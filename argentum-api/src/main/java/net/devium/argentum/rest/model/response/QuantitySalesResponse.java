package net.devium.argentum.rest.model.response;

public class QuantitySalesResponse {
    private final long product;
    private final long quantity;

    public QuantitySalesResponse(long product, long quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public long getProduct() {
        return product;
    }

    public long getQuantity() {
        return quantity;
    }
}
