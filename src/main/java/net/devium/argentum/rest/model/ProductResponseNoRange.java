package net.devium.argentum.rest.model;

import java.math.BigDecimal;

public class ProductResponseNoRange {
    private long id;
    private String name;
    private BigDecimal price;

    public ProductResponseNoRange() {
    }

    public ProductResponseNoRange(long id, String name, BigDecimal price) {
        this.id = id;
        this.name = name;
        this.price = price;
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
}
