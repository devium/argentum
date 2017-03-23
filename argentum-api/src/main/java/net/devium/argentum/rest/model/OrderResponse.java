package net.devium.argentum.rest.model;

import net.devium.argentum.jpa.OrderEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

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

    public static OrderResponse from(OrderEntity order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderItems().stream().map(OrderItemResponse::from).collect(Collectors.toList()),
                order.getTotal()
        );
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
