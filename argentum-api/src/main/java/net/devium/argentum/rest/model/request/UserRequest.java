package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.RoleEntity;
import net.devium.argentum.jpa.UserEntity;

import java.util.List;
import java.util.Set;

public class UserRequest {
    private Long id;
    private String username;
    private String password;
    private List<String> roles;

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getRoles() {
        return roles;
    }

    // Doesn't check for changed password. Do so manually.
    public UserEntity toEntity(Set<RoleEntity> roles) {
        return new UserEntity(
                id != null ? id : -1,
                username,
                password,
                roles
        );
    }
}
