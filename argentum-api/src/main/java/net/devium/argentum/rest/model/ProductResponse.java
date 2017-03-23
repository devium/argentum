package net.devium.argentum.rest.model;

import java.math.BigDecimal;
import java.util.List;

public class ProductResponse {
    private long id;
    private String name;
    private BigDecimal price;
    private List<Long> ranges;

    public ProductResponse() {
    }

    public ProductResponse(long id, String name, BigDecimal price, List<Long> ranges) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.ranges = ranges;
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

    public List<Long> getRanges() {
        return ranges;
    }
}
