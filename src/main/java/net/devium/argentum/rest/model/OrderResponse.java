package net.devium.argentum.rest.model;

import java.util.List;

public class OrderResponse {
    private long id;
    private String range;
    private List<OrderItemResponse> items;

    public OrderResponse() {
    }

    public OrderResponse(long id, String range, List<OrderItemResponse> items) {
        this.id = id;
        this.range = range;
        this.items = items;
    }

    public long getId() {
        return id;
    }

    public String getRange() {
        return range;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }
}
