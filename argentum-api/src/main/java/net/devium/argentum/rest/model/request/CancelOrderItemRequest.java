package net.devium.argentum.rest.model.request;

import java.math.BigDecimal;

public class CancelOrderItemRequest {
    // Union order ID if customTotal is used and cancelled is unused.
    private Long id;
    private int cancelled;
    private BigDecimal customTotal;

    public Long getId() {
        return id;
    }

    public int getCancelled() {
        return cancelled;
    }

    public BigDecimal getCustomTotal() {
        return customTotal;
    }
}
