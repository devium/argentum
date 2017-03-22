package net.devium.argentum.jpa;

import javax.persistence.*;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "product_ranges")
public class ProductRangeEntity {
    @Id
    @GeneratedValue
    private int id;
    private String name;

    @ManyToMany(mappedBy = "productRanges", fetch = FetchType.EAGER)
    private List<ProductEntity> products = Collections.emptyList();

    public ProductRangeEntity() {
    }

    public ProductRangeEntity(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
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
}
