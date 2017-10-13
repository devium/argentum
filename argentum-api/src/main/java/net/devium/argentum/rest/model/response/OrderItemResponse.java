package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.OrderItemEntity;

public class OrderItemResponse {
    private final long id;
    private final long productId;
    private final int quantity;
    private final int cancelled;

    private OrderItemResponse(long id, long productId, int quantity, int cancelled) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.cancelled = cancelled;
    }

    public static OrderItemResponse from(OrderItemEntity orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getProduct().getId(),
                orderItem.getQuantity(),
                orderItem.getCancelled()
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

    public int getCancelled() {
        return cancelled;
    }
}
