package net.devium.argentum.rest.model.request;

public class OrderItemRequest {
    private long productId;
    private int quantity;

    public long getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }
}
