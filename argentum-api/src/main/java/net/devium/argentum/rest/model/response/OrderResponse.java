package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.OrderEntity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {
    private final long id;
    private final Date time;
    private final List<OrderItemResponse> items;
    private final BigDecimal total;
    private final BigDecimal customCancelled;

    private OrderResponse(
            long id,
            Date time,
            List<OrderItemResponse> items,
            BigDecimal total,
            BigDecimal customCancelled
    ) {
        this.id = id;
        this.time = time;
        this.items = items;
        this.total = total;
        this.customCancelled = customCancelled;
    }

    public static OrderResponse from(OrderEntity order) {
        return new OrderResponse(
                order.getId(),
                order.getTime(),
                order.getOrderItems().stream().map(OrderItemResponse::from).collect(Collectors.toList()),
                order.getTotal(),
                order.getCustomCancelled()
        );
    }

    public long getId() {
        return id;
    }

    public Date getTime() {
        return time;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public BigDecimal getCustomCancelled() {
        return customCancelled;
    }
}
