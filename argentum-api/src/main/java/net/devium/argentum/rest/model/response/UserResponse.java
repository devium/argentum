package net.devium.argentum.rest.model.response;

import java.util.List;

public class UserResponse {
    private final String name;
    private final List<String> roles;

    public UserResponse(String name, List<String> roles) {
        this.name = name;
        this.roles = roles;
    }

    public String getName() {
        return name;
    }

    public List<String> getRoles() {
        return roles;
    }
}
