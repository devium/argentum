package net.devium.argentum.rest.model;

import net.devium.argentum.jpa.ProductEntity;

import java.math.BigDecimal;

public class ProductResponseMeta {
    private long id;
    private String name;
    private BigDecimal price;
    private boolean legacy;

    public ProductResponseMeta() {
    }

    public ProductResponseMeta(long id, String name, BigDecimal price, boolean legacy) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.legacy = legacy;
    }

    public static ProductResponseMeta from(ProductEntity product) {
        return new ProductResponseMeta(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.isLegacy()
        );
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public boolean isLegacy() {
        return legacy;
    }
}
