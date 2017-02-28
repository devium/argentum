package net.devium.argentum.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Collection;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue
    private long id;
    private String name;
    private BigDecimal price;

    @ManyToMany(mappedBy = "products")
    private Collection<ProductRange> productRanges;

    public Product() {
    }

    public Product(Collection<ProductRange> productRanges, String name, BigDecimal price) {
        this.productRanges = productRanges;
        this.name = name;
        this.price = price;
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

    public Collection<ProductRange> getProductRanges() {
        return productRanges;
    }

    public void setProductRanges(Collection<ProductRange> productRanges) {
        this.productRanges = productRanges;
    }
}
