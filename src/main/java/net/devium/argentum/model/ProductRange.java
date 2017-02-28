package net.devium.argentum.model;

import com.google.common.base.Objects;

import javax.persistence.*;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "product_ranges")
public class ProductRange {
    @Id
    private String id;
    private String name;

    @ManyToMany
    @JoinTable(name = "range_products")
    private Collection<Product> products = Collections.emptyList();

    public ProductRange() {
    }

    public ProductRange(String id, String name) {
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

    public Collection<Product> getProducts() {
        return products;
    }

    public void setProducts(Collection<Product> products) {
        this.products = products;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductRange that = (ProductRange) o;
        return Objects.equal(id, that.id) &&
                Objects.equal(name, that.name) &&
                Objects.equal(products, that.products);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, name, products);
    }
}
