package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.ProductRangeEntity;

public class ProductRangeRequest {
    private long id;
    private String name;

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ProductRangeEntity toEntity() {
        return new ProductRangeEntity(
                id,
                name != null ? name : ""
        );
    }
}
