package net.devium.argentum.rest.model.request;

import java.math.BigDecimal;
import java.util.List;

public class OrderRequest {
    private Long guestId;
    private List<OrderItemRequest> items;
    private BigDecimal customTotal;

    public Long getGuestId() {
        return guestId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public BigDecimal getCustomTotal() {
        return customTotal;
    }
}
