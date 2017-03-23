package net.devium.argentum.rest.model;

import net.devium.argentum.jpa.OrderEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {
    private final long id;
    private final List<OrderItemResponse> items;
    private final BigDecimal total;

    private OrderResponse(long id, List<OrderItemResponse> items, BigDecimal total) {
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
