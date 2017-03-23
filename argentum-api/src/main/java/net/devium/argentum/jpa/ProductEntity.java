package net.devium.argentum.jpa;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
public class ProductEntity {

    @Id
    @GeneratedValue
    private long id;
    private String name;
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;
    private boolean legacy = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "range_products")
    private List<ProductRangeEntity> productRanges;

    public ProductEntity() {
    }

    public ProductEntity(String name, BigDecimal price, CategoryEntity category,
                         List<ProductRangeEntity> productRanges) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.productRanges = productRanges;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
    }

    public boolean isLegacy() {
        return legacy;
    }

    public void setLegacy(boolean legacy) {
        this.legacy = legacy;
    }

    public List<ProductRangeEntity> getProductRanges() {
        return productRanges;
    }

    public void setProductRanges(List<ProductRangeEntity> productRanges) {
        this.productRanges = productRanges;
    }
}
