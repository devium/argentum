package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.CoatCheckTagEntity;
import net.devium.argentum.jpa.GuestEntity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class CoatCheckTagsRequest {
    private List<Long> ids;
    private Long guestId;
    private BigDecimal price;

    public List<Long> getIds() {
        return ids;
    }

    public Long getGuestId() {
        return guestId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public List<CoatCheckTagEntity> toEntities(GuestEntity guest) {
        Date time = new Date();
        return ids.stream()
            .map(id -> new CoatCheckTagEntity(id, time, guest))
            .collect(Collectors.toList());
    }
}
