package net.devium.argentum.rest;

import net.devium.argentum.jpa.GuestEntity;
import net.devium.argentum.jpa.GuestRepository;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;

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
}
