package net.devium.argentum.rest.model;

import net.devium.argentum.jpa.OrderItemEntity;

public class OrderItemResponse {
    private final long id;
    private final long productId;
    private final int quantity;

    private OrderItemResponse(long id, long productId, int quantity) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
    }

    public static OrderItemResponse from(OrderItemEntity orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getProduct().getId(),
                orderItem.getQuantity()
        );
    }

    public long getId() {
        return id;
    }

    public long getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }
}
