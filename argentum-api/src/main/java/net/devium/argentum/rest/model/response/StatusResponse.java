package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.StatusEntity;

public class StatusResponse {
    private final long id;
    private final String internalName;
    private final String displayName;
    private final String color;

    private StatusResponse(long id, String internalName, String displayName, String color) {
        this.id = id;
        this.internalName = internalName;
        this.displayName = displayName;
        this.color = color;
    }

    public static StatusResponse from(StatusEntity status) {
        return new StatusResponse(
                status.getId(),
                status.getInternalName(),
                status.getDisplayName(),
                status.getColor()
        );
    }

    public long getId() {
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
}
