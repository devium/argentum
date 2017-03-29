package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.RoleEntity;
import net.devium.argentum.jpa.UserEntity;

import java.util.List;
import java.util.stream.Collectors;

public class UserResponse {
    private final long id;
    private final String username;
    private final List<String> roles;

    private UserResponse(long id, String name, List<String> roles) {
        this.id = id;
        this.username = name;
        this.roles = roles;
    }

    public static UserResponse from(UserEntity user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList())
        );
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public List<String> getRoles() {
        return roles;
    }
}
