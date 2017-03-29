package net.devium.argentum.rest;

import net.devium.argentum.jpa.Role;
import net.devium.argentum.jpa.User;
import net.devium.argentum.jpa.UserRepository;
import net.devium.argentum.rest.model.response.Response;
import net.devium.argentum.rest.model.response.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getUser(Principal principal) {
        User user = userRepository.findByUsername(principal.getName());

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        UserResponse response = new UserResponse(user.getUsername(), roles);

        return Response.ok(response);
    }
}
