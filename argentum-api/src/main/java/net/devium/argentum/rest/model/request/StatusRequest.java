package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.StatusEntity;

public class StatusRequest {
    private Long id;
    private String internalName;
    private String displayName;
    private String color;

    public Long getId() {
        return id;
    }

    public String getInternalName() {
        return internalName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getColor() {
        return color;
    }

    public StatusEntity toEntity() {
        return new StatusEntity(
                id != null ? id : -1,
                internalName != null ? internalName : "",
                displayName != null ? displayName : "",
                color != null ? color : "#ffffff"
        );
    }
}
