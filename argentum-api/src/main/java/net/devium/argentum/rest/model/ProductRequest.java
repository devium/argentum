package net.devium.argentum.rest.model;

import java.math.BigDecimal;
import java.util.List;

public class ProductRequest {
    private String name;
    private BigDecimal price;
    private List<Long> ranges;

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
