package net.devium.argentum.model;

import javax.persistence.*;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "product_ranges")
public class ProductRange {
    @Id
    private String id;

    @ManyToMany
    @JoinTable(name = "range_products")
    private Collection<Product> products = Collections.emptyList();

    public ProductRange(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
