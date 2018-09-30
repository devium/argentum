package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.request.GuestRequest;
import net.devium.argentum.rest.model.response.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;

@RestController
@RequestMapping("/guests")
public class GuestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private GuestRepository guestRepository;
    private CoatCheckTagRepository coatCheckTagRepository;
    private OrderRepository orderRepository;
    private BalanceEventRepository balanceEventRepository;

    @Autowired
    public GuestController(
            GuestRepository guestRepository,
            CoatCheckTagRepository coatCheckTagRepository,
            OrderRepository orderRepository,
            BalanceEventRepository balanceEventRepository
    ) {
        this.guestRepository = guestRepository;
        this.coatCheckTagRepository = coatCheckTagRepository;
        this.orderRepository = orderRepository;
        this.balanceEventRepository = balanceEventRepository;
    }

    @RequestMapping(
            method = RequestMethod.GET,
            params = {"page", "size", "code", "name", "mail", "status", "sort", "direction"},
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<?> getGuests(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String code,
            @RequestParam String name,
            @RequestParam String mail,
            @RequestParam String status,
            @RequestParam String sort,
            @RequestParam String direction
    ) {
        Set<String> supportedSortFields = ImmutableSet.of(
                "id",
                "code",
                "name",
                "mail",
                "status",
                "checkedIn",
                "balance",
                "bonus"
        );
        sort = supportedSortFields.contains(sort) ? sort : "id";
        Pageable pageRequest = new PageRequest(
                page,
                size,
                new Sort(direction.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sort)
        );
        Page<GuestEntity> guests = guestRepository
                .findByCodeContainsAndNameContainsAndMailContainsAndStatusContainsAllIgnoreCase(
                        code, name, mail, status, pageRequest);

        Page<GuestResponse> response = guests.map(GuestResponse::from);
        return Response.ok(new GuestResponsePaginated(response.getContent(), response.getTotalElements()));
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> mergeGuests(@RequestBody List<GuestRequest> guests) {
        List<GuestEntity> mergedGuests = guests.stream()
                .map(GuestRequest::toEntity)
                .collect(Collectors.toList());
        List<String> cards = mergedGuests.stream()
                .map(GuestEntity::getCard)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Check for card duplicates.
        if (new HashSet<>(cards).size() < cards.size()) {
            String message = "Duplicate cards found in guest list.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        // Steal card if already in use.
        List<GuestEntity> cardVictims = guestRepository.findByCardIn(cards);
        cardVictims.forEach(guest -> guest.setCard(null));
        guestRepository.save(cardVictims);

        mergedGuests = this.guestRepository.save(mergedGuests);

        Date date = new Date();
        List<BalanceEventEntity> balanceEvents = mergedGuests.stream()
                .filter(guest -> guest.getBalance().compareTo(BigDecimal.ZERO) != 0)
                .map(guest -> new BalanceEventEntity(guest, date, guest.getBalance(), "balance"))
                .collect(Collectors.toList());

        this.balanceEventRepository.save(balanceEvents);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> deleteGuests() {
        balanceEventRepository.deleteAll();
        coatCheckTagRepository.deleteAll();
        orderRepository.deleteAll();
        guestRepository.deleteAll();

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(path = "/card/{card}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getByCard(@PathVariable String card) {
        GuestEntity guest = guestRepository.findByCard(card);
        if (guest == null) {
            String message = String.format("Card %s not found.", card);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        return Response.ok(GuestResponse.from(guest));
    }

    @RequestMapping(path = "/search/{field}/{search}", method = RequestMethod.GET, produces = MediaType
            .APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getBySearch(@PathVariable String field, @PathVariable String search) {
        List <GuestEntity> guests;
        if (field.equalsIgnoreCase("code")) {
            guests = guestRepository.findFirst3ByCodeContainsIgnoreCase(search);
        } else if (field.equalsIgnoreCase("name")) {
            guests = guestRepository.findFirst3ByNameContainsIgnoreCase(search);
        } else if (field.equalsIgnoreCase("mail")) {
            guests = guestRepository.findFirst3ByMailContainsIgnoreCase(search);
        } else {
            return Response.badRequest("Can only search by code, name, or mail.");
        }

        List<GuestResponse> response = guests.stream()
                .map(GuestResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(path = "/{guestId}/balance", method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> addBalance(@PathVariable long guestId, @RequestBody BigDecimal value) {
        GuestEntity guest = guestRepository.findOne(guestId);

        if (guest == null) {
            String message = String.format("Guest %s not found.", guestId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        BalanceEventEntity event = new BalanceEventEntity(guest, new Date(), value, "balance");
        this.balanceEventRepository.save(event);

        guest.setBalance(guest.getBalance().add(value.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        guest = guestRepository.save(guest);
        return Response.ok(guest.getBalance());
    }

    @RequestMapping(path = "/{guestId}/bonus", method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> addBonus(@PathVariable long guestId, @RequestBody BigDecimal value) {
        GuestEntity guest = guestRepository.findOne(guestId);

        if (guest == null) {
            String message = String.format("Guest %s not found.", guestId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        guest.setBonus(guest.getBonus().add(value.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        guest = guestRepository.save(guest);
        return Response.ok(guest.getBonus());
    }

    @RequestMapping(path = "/{guestId}/card", method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> setCard(@PathVariable long guestId, @RequestBody String card) {
        GuestEntity guest = guestRepository.findOne(guestId);

        if (guest == null) {
            String message = String.format("Guest %s not found.", guestId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        // Steal card from old guest.
        GuestEntity victim = guestRepository.findByCard(card);
        if (victim != null) {
            victim.setCard(null);
            guestRepository.save(victim);
        }

        guest.setCard(card);
        guestRepository.save(guest);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping(path = "/{guestId}/checkin", method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> checkIn(@PathVariable long guestId) {
        GuestEntity guest = guestRepository.findOne(guestId);

        if (guest == null) {
            String message = String.format("Guest %s not found.", guestId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        guest.setCheckedIn(new Date());
        guestRepository.save(guest);

        return Response.ok(guest.getCheckedIn());
    }

    @RequestMapping(
            path = "/{guestId}/orders",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    @Transactional
    public ResponseEntity<?> getOrders(@PathVariable long guestId) {
        GuestEntity guest = guestRepository.findOne(guestId);

        if (guest == null) {
            String message = String.format("Guest %s not found.", guestId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        List<OrderResponse> response = orderRepository.findByGuest(guest).stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(
            path = "/{guestId}/coat_check_tags",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    @Transactional
    public ResponseEntity<?> getCoatCheckTags(@PathVariable long guestId) {
        GuestEntity guest = guestRepository.findOne(guestId);

        if (guest == null) {
            String message = String.format("Guest %s not found.", guestId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        List<CoatCheckTagResponse> response = coatCheckTagRepository.findByGuest(guest).stream()
                .map(CoatCheckTagResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }
}
