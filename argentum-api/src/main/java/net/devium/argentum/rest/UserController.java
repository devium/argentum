package net.devium.argentum.rest;

import net.devium.argentum.jpa.RoleEntity;
import net.devium.argentum.jpa.RoleRepository;
import net.devium.argentum.jpa.UserEntity;
import net.devium.argentum.jpa.UserRepository;
import net.devium.argentum.rest.model.request.UserRequest;
import net.devium.argentum.rest.model.response.Response;
import net.devium.argentum.rest.model.response.UserResponse;
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
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private UserRepository userRepository;

    private RoleRepository roleRepository;

    @Autowired
    public UserController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getUsers() {
        List<UserEntity> users = userRepository.findAll();

        List<UserResponse> response = users.stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> mergeUsers(@RequestBody List<UserRequest> users) {
        // Check for duplicate usernames.
        Set<String> usernames = users.stream()
                .map(UserRequest::getUsername)
                .collect(Collectors.toSet());

        if (usernames.size() < users.size()) {
            String message = "Duplicate usernames found.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        // Check for existing usernames with differing IDs.
        for (UserRequest user : users) {
            UserEntity storedUser = userRepository.findByUsername(user.getUsername());
            if (storedUser != null && (user.getId() == null || storedUser.getId() != user.getId())) {
                String message = String.format("Username %s already exists.", user.getUsername());
                LOGGER.info(message);
                return Response.badRequest(message);
            }
        }

        // Manage unchanged passwords.
        List<UserRequest> unchangedPasswordUsers = users.stream()
                .filter(user -> user.getPassword() == null)
                .collect(Collectors.toList());

        Set<Long> unchangedPasswordUserIds = unchangedPasswordUsers.stream()
                .map(user -> user.getId() != null ? user.getId() : -1)
                .collect(Collectors.toSet());

        Map<Long, UserEntity> storedUnchangedPasswordUsers = userRepository.findAll(unchangedPasswordUserIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        if (storedUnchangedPasswordUsers.size() < unchangedPasswordUserIds.size()) {
            unchangedPasswordUserIds.removeAll(storedUnchangedPasswordUsers.keySet());

            String message = String.format("Unknown user(s) %s with unchanged password.", unchangedPasswordUserIds);
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        unchangedPasswordUsers.forEach(request -> request.setPassword(
                storedUnchangedPasswordUsers.get(request.getId()).getPassword())
        );

        // Convert and store all requests.
        List<UserEntity> mergedUsers = new LinkedList<>();
        for (UserRequest user : users) {
            Set<RoleEntity> roles = new HashSet<>(roleRepository.findByNameIn(user.getRoles()));

            if (roles.contains(null)) {
                String message = String.format("User %s has unknown roles.", user.getId());
                LOGGER.info(message);
                return Response.badRequest(message);
            }

            mergedUsers.add(user.toEntity(roles));
        }

        userRepository.save(mergedUsers);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> deleteUsers(@RequestBody List<Long> userIds) {
        if (userIds.isEmpty()) {
            String message = "No users to delete.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        Set<Long> unknownUsers = new HashSet<>();
        Set<UserEntity> users = new HashSet<>();

        for (long categoryId : userIds) {
            UserEntity category = userRepository.findOne(categoryId);

            if (category == null) {
                unknownUsers.add(categoryId);
            } else {
                users.add(category);
            }
        }

        if (!unknownUsers.isEmpty()) {
            String message = String.format("User(s) %s not found.", unknownUsers);
            LOGGER.info(message);
            return Response.notFound(message);
        }
        userRepository.delete(users);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(path = "/me", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getUser(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName());

        return Response.ok(UserResponse.from(user));
    }
}
