package net.devium.argentum.rest;

import net.devium.argentum.jpa.GuestEntity;
import net.devium.argentum.jpa.GuestRepository;
import net.devium.argentum.rest.model.request.GuestRequest;
import net.devium.argentum.rest.model.response.GuestResponse;
import net.devium.argentum.rest.model.response.GuestResponsePaginated;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static net.devium.argentum.ApplicationConstants.DECIMAL_PLACES;

@RestController
@RequestMapping("/guests")
public class GuestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private GuestRepository guestRepository;

    @Autowired
    public GuestController(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @RequestMapping(method = RequestMethod.GET, params = {"page", "size", "code", "name", "mail", "status"},
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getGuests(@RequestParam int page, @RequestParam int size, @RequestParam String code,
                                       @RequestParam String name, @RequestParam String mail,
                                       @RequestParam String status) {
        Pageable pageRequest = new PageRequest(page, size);
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

        List<String> codes = mergedGuests.stream()
                .map(GuestEntity::getCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        List<String> cards = mergedGuests.stream()
                .map(GuestEntity::getCard)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Check for code and card duplicates.
        if (new HashSet<>(codes).size() < codes.size()) {
            String message = "Duplicate codes found in request.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }
        if (new HashSet<>(cards).size() < cards.size()) {
            String message = "Duplicate cards found in request.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        // Steal code and card if already in use.
        List<GuestEntity> codeVictims = guestRepository.findByCodeIn(codes);
        codeVictims.forEach(guest -> guest.setCode(null));
        List<GuestEntity> cardVictims = guestRepository.findByCardIn(cards);
        cardVictims.forEach(guest -> guest.setCard(null));

        List<GuestEntity> allVictims = new LinkedList<>(codeVictims);
        allVictims.addAll(cardVictims);
        guestRepository.save(allVictims);

        List<GuestResponse> response = this.guestRepository.save(mergedGuests).stream()
                .map(GuestResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
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

    @RequestMapping(path = "/code/{code}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        List<GuestEntity> guests = guestRepository.findFirst3ByCodeContainsIgnoreCase(code);

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
        guest = guestRepository.save(guest);
        return ResponseEntity.noContent().build();
    }
}
