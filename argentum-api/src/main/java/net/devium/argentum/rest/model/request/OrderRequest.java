package net.devium.argentum.rest.model.request;

import java.util.List;

public class OrderRequest {
    private Long guestId;
    private List<OrderItemRequest> items;

    public Long getGuestId() {
        return guestId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }
}
