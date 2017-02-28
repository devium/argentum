package net.devium.argentum.rest.model;

import java.math.BigDecimal;
import java.util.List;

public class ProductRequest {
    private String name;
    private BigDecimal price;
    private List<String> ranges;

    public ProductRequest() {
    }

    public ProductRequest(String name, BigDecimal price, List<String> ranges) {
        this.name = name;
        this.price = price;
        this.ranges = ranges;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public List<String> getRanges() {
        return ranges;
    }
}
