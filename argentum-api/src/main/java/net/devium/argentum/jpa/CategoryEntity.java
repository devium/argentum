package net.devium.argentum.jpa;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "categories")
public class CategoryEntity {
    @Id
    @GeneratedValue
    private long id;
    private String name;
    private String color;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "category")
    private List<ProductEntity> products;

    public CategoryEntity() {
    }

    public CategoryEntity(String name, String color) {
        this.name = name;
        this.color = color;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductEntity> products) {
        this.products = products;
    }
}
