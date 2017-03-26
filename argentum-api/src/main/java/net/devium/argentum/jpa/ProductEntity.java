package net.devium.argentum.jpa;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Set;

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
    private Set<ProductRangeEntity> productRanges;

    public ProductEntity() {
    }

    // Create
    public ProductEntity(String name, BigDecimal price, CategoryEntity category,
                         Set<ProductRangeEntity> productRanges) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.productRanges = productRanges;
    }

    // Mainly testing
    public ProductEntity(String name, BigDecimal price, CategoryEntity category, boolean legacy,
                         Set<ProductRangeEntity> productRanges) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.legacy = legacy;
        this.productRanges = productRanges;
    }

    // Update
    public ProductEntity(long id, String name, BigDecimal price, CategoryEntity category,
                         Set<ProductRangeEntity> productRanges) {
        this.id = id;
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

    public Set<ProductRangeEntity> getProductRanges() {
        return productRanges;
    }

    public void setProductRanges(Set<ProductRangeEntity> productRanges) {
        this.productRanges = productRanges;
    }

    public void removeProductRanges(Set<ProductRangeEntity> ranges) {
        this.productRanges.removeAll(ranges);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProductEntity that = (ProductEntity) o;

        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
