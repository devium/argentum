package net.devium.argentum.model;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "product_ranges")
public class ProductRange {
    @Id
    private String name;

    @ManyToMany
    @JoinTable(name = "range_products")
    private Collection<Product> products;
}
