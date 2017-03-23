package net.devium.argentum.rest.model;

import net.devium.argentum.jpa.ProductRangeEntity;

public class ProductRangeResponseMeta {
    private long id;
    private String name;

    public ProductRangeResponseMeta() {
    }

    public ProductRangeResponseMeta(long id, String name) {
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
