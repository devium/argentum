package net.devium.argentum.rest.model;

import java.util.List;

public class OrderRequest {
    private int guestId;
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public OrderRequest(int guestId, List<OrderItemRequest> items) {
        this.guestId = guestId;
        this.items = items;
    }

    public int getGuestId() {
        return guestId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }
}
