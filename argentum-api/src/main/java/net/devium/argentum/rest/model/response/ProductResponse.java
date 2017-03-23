package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class ProductResponse {
    private final long id;
    private final String name;
    private final BigDecimal price;
    private final long category;
    private final boolean legacy;
    private final List<Long> ranges;

    private ProductResponse(long id, String name, BigDecimal price, long category, boolean legacy, List<Long> ranges) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.legacy = legacy;
        this.ranges = ranges;
    }

    public static ProductResponse from(ProductEntity product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCategory().getId(),
                product.isLegacy(),
                product.getProductRanges().stream().map(ProductRangeEntity::getId).collect(Collectors.toList())
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

    public List<Long> getRanges() {
        return ranges;
    }
}
