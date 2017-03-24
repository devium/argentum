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
import java.util.List;
import java.util.stream.Collectors;

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

        List<GuestResponse> response = this.guestRepository.save(mergedGuests).stream()
                .map(GuestResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }
}
