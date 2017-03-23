package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.CategoryRepository;
import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeRepository;

import java.math.BigDecimal;
import java.util.List;

public class ProductRequest {
    private String name;
    private BigDecimal price;
    private long category;
    private List<Long> ranges;

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public long getCategory() {
        return category;
    }

    public List<Long> getRanges() {
        return ranges;
    }

    public ProductEntity toEntity(CategoryRepository categoryRepository,
                                  ProductRangeRepository productRangeRepository) {
        return new ProductEntity(
                this.name,
                this.price,
                categoryRepository.findOne(this.category),
                productRangeRepository.findAll(ranges)
        );
    }
}
