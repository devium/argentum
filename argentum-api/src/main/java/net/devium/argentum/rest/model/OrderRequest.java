package net.devium.argentum.rest.model;

import java.util.List;

public class OrderRequest {
    private long guestId;
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public OrderRequest(long guestId, List<OrderItemRequest> items) {
        this.guestId = guestId;
        this.items = items;
    }

    public long getGuestId() {
        return guestId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }
}
