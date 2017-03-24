package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.OrderEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {
    private final long id;
    private final long guestId;
    private final List<OrderItemResponse> items;
    private final BigDecimal total;

    private OrderResponse(long id, long guestId, List<OrderItemResponse> items, BigDecimal total) {
        this.id = id;
        this.guestId = guestId;
        this.items = items;
        this.total = total;
    }

    public static OrderResponse from(OrderEntity order) {
        return new OrderResponse(
                order.getId(),
                order.getGuest().getId(),
                order.getOrderItems().stream().map(OrderItemResponse::from).collect(Collectors.toList()),
                order.getTotal()
        );
    }

    public long getId() {
        return id;
    }

    public long getGuestId() {
        return guestId;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public BigDecimal getTotal() {
        return total;
    }
}
