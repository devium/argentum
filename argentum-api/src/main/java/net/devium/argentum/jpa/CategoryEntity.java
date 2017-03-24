package net.devium.argentum.jpa;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "categories")
public class CategoryEntity {
    @Id
    @GeneratedValue
    private long id;
    private String name;
    private String color;

    @OneToMany(mappedBy = "category", fetch = FetchType.EAGER)
    private Set<ProductEntity> products;

    public CategoryEntity() {
    }

    // Create
    public CategoryEntity(String name, String color) {
        this.name = name;
        this.color = color;
    }

    // Update
    public CategoryEntity(long id, String name, String color) {
        this.id = id;
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

    public Set<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(Set<ProductEntity> products) {
        this.products = products;
    }

    public void assign(CategoryEntity other) {
        this.name = other.getName();
        this.color = other.getColor();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CategoryEntity that = (CategoryEntity) o;

        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
