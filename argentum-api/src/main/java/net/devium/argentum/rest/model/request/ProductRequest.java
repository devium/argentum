package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.CategoryEntity;
import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static net.devium.argentum.ApplicationConstants.DECIMAL_PLACES;

public class ProductRequest {
    private Long id;
    private String name;
    private BigDecimal price;
    private Long category;
    private List<Long> ranges;

    public Long getId() {
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

    public ProductEntity toEntity(CategoryEntity category, Set<ProductRangeEntity> ranges) {
        return new ProductEntity(
                id != null ? id : -1,
                name != null ? name : "",
                price != null ? price.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)
                        : new BigDecimal(0).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP),
                category,
                ranges
        );
    }
}
