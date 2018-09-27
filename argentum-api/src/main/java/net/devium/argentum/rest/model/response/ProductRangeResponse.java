package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.ProductRangeEntity;

public class ProductRangeResponse {
    private final long id;
    private final String name;

    private ProductRangeResponse(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ProductRangeResponse from(ProductRangeEntity range) {
        return new ProductRangeResponse(
                range.getId(),
                range.getName()
        );
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
