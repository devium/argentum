package net.devium.argentum.rest.model.request;

import java.util.List;

public class OrderRequest {
    private long guestId;
    private List<OrderItemRequest> items;

    public long getGuestId() {
        return guestId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }
}
