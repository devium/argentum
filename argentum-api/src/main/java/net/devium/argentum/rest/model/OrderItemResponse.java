package net.devium.argentum.rest.model;

public class OrderItemResponse {
    private long productId;
    private int quantity;

    public OrderItemResponse() {
    }

    public OrderItemResponse(long productId, int quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public long getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }
}
