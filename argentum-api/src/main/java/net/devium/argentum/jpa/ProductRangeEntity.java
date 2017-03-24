package net.devium.argentum.jpa;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "product_ranges")
public class ProductRangeEntity {
    @Id
    @GeneratedValue
    private long id;
    private String name;

    @ManyToMany(mappedBy = "productRanges", fetch = FetchType.EAGER)
    private Set<ProductEntity> products;

    public ProductRangeEntity() {
    }

    // Create
    public ProductRangeEntity(String name) {
        this.name = name;
    }

    // Update
    public ProductRangeEntity(long id, String name) {
        this.id = id;
        this.name = name;
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

    public Set<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(Set<ProductEntity> products) {
        this.products = products;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProductRangeEntity that = (ProductRangeEntity) o;

        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
