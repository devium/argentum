package net.devium.argentum.rest.model;

import net.devium.argentum.jpa.ProductRangeEntity;

public class ProductRangeResponseMeta {
    private final long id;
    private final String name;

    private ProductRangeResponseMeta(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ProductRangeResponseMeta from(ProductRangeEntity range) {
        return new ProductRangeResponseMeta(
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
