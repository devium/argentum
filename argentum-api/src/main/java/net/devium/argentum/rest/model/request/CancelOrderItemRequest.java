package net.devium.argentum.rest.model.request;

import java.math.BigDecimal;

public class CancelOrderItemRequest {
    // Union order ID if customCancelled is used and cancelled is unused.
    private Long id;
    private int cancelled;
    private BigDecimal customCancelled;

    public Long getId() {
        return id;
    }

    public int getCancelled() {
        return cancelled;
    }

    public BigDecimal getCustomCancelled() {
        return customCancelled;
    }
}
