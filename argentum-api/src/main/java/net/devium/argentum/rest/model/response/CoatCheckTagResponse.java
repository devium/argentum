package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.CoatCheckTagEntity;

import java.util.Date;

public class CoatCheckTagResponse {
    private final long id;
    private final Date time;
    private final GuestResponse guest;

    private CoatCheckTagResponse(
            long id,
            Date time,
            GuestResponse guest
    ) {
        this.id = id;
        this.time = time;
        this.guest = guest;
    }

    public static CoatCheckTagResponse from(CoatCheckTagEntity coatCheckTag) {
        return new CoatCheckTagResponse(
                coatCheckTag.getId(),
                coatCheckTag.getTime(),
                GuestResponse.from(coatCheckTag.getGuest())
        );
    }

    public long getId() {
        return id;
    }

    public Date getTime() {
        return time;
    }

    public GuestResponse getGuest() {
        return guest;
    }
}