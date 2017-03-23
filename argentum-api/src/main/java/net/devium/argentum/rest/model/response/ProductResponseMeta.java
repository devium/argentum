package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.ProductEntity;

import java.math.BigDecimal;

public class ProductResponseMeta {
    private final long id;
    private final String name;
    private final BigDecimal price;
    private final long category;
    private final boolean legacy;

    private ProductResponseMeta(long id, String name, BigDecimal price, long category, boolean legacy) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.legacy = legacy;
    }

    public static ProductResponseMeta from(ProductEntity product) {
        return new ProductResponseMeta(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCategory().getId(),
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

    public long getCategory() {
        return category;
    }

    public boolean isLegacy() {
        return legacy;
    }
}
