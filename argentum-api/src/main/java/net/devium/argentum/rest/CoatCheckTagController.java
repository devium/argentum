package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.request.CoatCheckTagsRequest;
import net.devium.argentum.rest.model.response.CoatCheckTagResponse;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;

@RestController
@RequestMapping("/coat_check")
public class CoatCheckTagController extends AbstractBalanceController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private CoatCheckTagRepository coatCheckTagRepository;

    @Autowired
    public CoatCheckTagController(
            CoatCheckTagRepository coatCheckTagRepository,
            BalanceEventRepository balanceEventRepository,
            GuestRepository guestRepository,
            ConfigRepository configRepository
    ) {
        super(guestRepository, balanceEventRepository, configRepository);
        this.coatCheckTagRepository = coatCheckTagRepository;
    }

    @RequestMapping(
            method = RequestMethod.GET,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<?> getTags(@RequestBody List<Long> coatCheckTagIds) {
        // Do a naive lookup because this method may be used to check for tag occupation.
        List<CoatCheckTagResponse> response = coatCheckTagRepository.findAll(coatCheckTagIds).stream()
                .map(CoatCheckTagResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllTags() {
        List<Long> response = coatCheckTagRepository.findAll().stream()
                .map(CoatCheckTagEntity::getId)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(
            method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    @Transactional
    public ResponseEntity<?> registerTags(@RequestBody CoatCheckTagsRequest coatCheckTags) {
        // Registered tags need to be manually unregistered before they can be used again.
        List<Long> savedCoatCheckTagIds = coatCheckTagRepository.findAll(coatCheckTags.getIds()).stream()
                .map(CoatCheckTagEntity::getId)
                .collect(Collectors.toList());

        if (!savedCoatCheckTagIds.isEmpty()) {
            String message = String.format(
                    "The following tags are already registered: %s.",
                    savedCoatCheckTagIds
            );
            LOGGER.warn(message);
            return Response.badRequest(message);
        }

        // Check guest for existence.
        GuestEntity guest = guestRepository.findOne(coatCheckTags.getGuestId());
        if (guest == null) {
            String message = String.format("Guests not found: %s.", coatCheckTags.getGuestId());
            LOGGER.warn(message);
            return Response.notFound(message);
        }
        BigDecimal total = coatCheckTags.getPrice().setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP);

        ResponseEntity<?> creditResponse = credit(guest, total);
        if (creditResponse != null) {
            return creditResponse;
        }

        String eventDescription = String.format("coat check tags %s", coatCheckTags.getIds());
        balanceEventRepository.save(new BalanceEventEntity(guest, new Date(), total.negate(), eventDescription));

        List<CoatCheckTagEntity> newCoatCheckTags = coatCheckTags.toEntities(guest);
        List<CoatCheckTagResponse> response = coatCheckTagRepository.save(newCoatCheckTags).stream()
                .map(CoatCheckTagResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(
            method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    @Transactional
    public ResponseEntity<?> deregisterTags(@RequestBody List<Long> coatCheckTagIds) {
        // Deregistering unregistered tags is ok.
        List<CoatCheckTagEntity> savedCoatCheckTags = coatCheckTagRepository.findAll(coatCheckTagIds);
        coatCheckTagRepository.delete(savedCoatCheckTags);

        return ResponseEntity.noContent().build();
    }
}
