package net.devium.argentum.rest.model;

import java.math.BigDecimal;
import java.util.List;

public class OrderResponse {
    private long id;
    private List<OrderItemResponse> items;
    private BigDecimal total;

    public OrderResponse() {
    }

    public OrderResponse(long id, List<OrderItemResponse> items, BigDecimal total) {
        this.id = id;
        this.items = items;
        this.total = total;
    }

    public long getId() {
        return id;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public BigDecimal getTotal() {
        return total;
    }
}
