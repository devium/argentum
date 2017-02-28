package net.devium.argentum.jpa;

import javax.persistence.*;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "product_ranges")
public class ProductRangeEntity {
    @Id
    private String id;
    private String name;

    @ManyToMany(mappedBy = "productRanges", fetch = FetchType.EAGER)
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
}
