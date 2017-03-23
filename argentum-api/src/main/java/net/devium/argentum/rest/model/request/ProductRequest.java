package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.CategoryEntity;
import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;

import java.math.BigDecimal;
import java.util.List;

public class ProductRequest {
    private long id;
    private String name;
    private BigDecimal price;
    private Long category;
    private List<Long> ranges;

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Long getCategory() {
        return category;
    }

    public List<Long> getRanges() {
        return ranges;
    }

    public ProductEntity toEntity(CategoryEntity category, List<ProductRangeEntity> ranges) {
        return new ProductEntity(
                id,
                name != null ? name : "",
                price != null ? price : new BigDecimal(0.00),
                category,
                ranges
        );
    }
}
