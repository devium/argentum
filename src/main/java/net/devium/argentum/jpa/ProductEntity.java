package net.devium.argentum.jpa;

import com.google.common.base.Objects;

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

    @ManyToMany
    @JoinTable(name = "range_products")
    private List<ProductRangeEntity> productRanges;

    public ProductEntity() {
    }

    public ProductEntity(String name, BigDecimal price, List<ProductRangeEntity> productRanges) {
        this.name = name;
        this.price = price;
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

    public List<ProductRangeEntity> getProductRanges() {
        return productRanges;
    }

    public void setProductRanges(List<ProductRangeEntity> productRanges) {
        this.productRanges = productRanges;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductEntity that = (ProductEntity) o;
        return id == that.id &&
                Objects.equal(name, that.name) &&
                Objects.equal(price, that.price) &&
                Objects.equal(productRanges, that.productRanges);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, name, price, productRanges);
    }
}
