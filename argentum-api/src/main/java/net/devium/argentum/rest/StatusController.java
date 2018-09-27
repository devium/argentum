package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.request.StatusRequest;
import net.devium.argentum.rest.model.response.Response;
import net.devium.argentum.rest.model.response.StatusResponse;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/statuses")
public class StatusController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private StatusRepository statusRepository;

    @Autowired
    public StatusController(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getStatuses() {
        List<StatusResponse> statuses = statusRepository.findAll().stream()
                .map(StatusResponse::from)
                .collect(Collectors.toList());

        return Response.ok(statuses);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> mergeStatuses(@RequestBody List<StatusRequest> statuses) {
        List<StatusEntity> mergedStatuses = statuses.stream()
                .map(StatusRequest::toEntity)
                .collect(Collectors.toList());

        statusRepository.save(mergedStatuses);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> deleteStatuses(@RequestBody List<Long> statusIds) {
        if (statusIds.isEmpty()) {
            String message = "No statuses to delete.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        Set<Long> unknownStatuses = new HashSet<>();
        Set<StatusEntity> statuses = new HashSet<>();

        for (long statusId : statusIds) {
            StatusEntity status = statusRepository.findOne(statusId);

            if (status == null) {
                unknownStatuses.add(statusId);
            } else {
                statuses.add(status);
            }
        }

        if (!unknownStatuses.isEmpty()) {
            String message = String.format("Status(es) %s not found.", unknownStatuses);
            LOGGER.info(message);
            return Response.notFound(message);
        }
        statusRepository.delete(statuses);

        return ResponseEntity.noContent().build();
    }
}
