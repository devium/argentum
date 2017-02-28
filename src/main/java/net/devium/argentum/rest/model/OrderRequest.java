package net.devium.argentum.rest.model;

import java.util.List;

public class OrderRequest {
    private String range;
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public OrderRequest(String range, List<OrderItemRequest> items) {
        this.range = range;
        this.items = items;
    }

    public String getRange() {
        return range;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }
}
