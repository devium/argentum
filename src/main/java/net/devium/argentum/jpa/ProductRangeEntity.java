package net.devium.argentum.jpa;

import com.google.common.base.Objects;

import javax.persistence.*;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "product_ranges")
public class ProductRangeEntity {
    @Id
    private String id;
    private String name;

    @ManyToMany
    @JoinTable(name = "range_products")
    private List<ProductEntity> products = Collections.emptyList();

    public ProductRangeEntity() {
    }

    public ProductRangeEntity(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductEntity> products) {
        this.products = products;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductRangeEntity that = (ProductRangeEntity) o;
        return Objects.equal(id, that.id) &&
                Objects.equal(name, that.name) &&
                Objects.equal(products, that.products);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, name, products);
    }
}
