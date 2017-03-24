package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.CategoryEntity;

public class CategoryRequest {
    private Long id;
    private String name;
    private String color;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public CategoryEntity toEntity() {
        return new CategoryEntity(
                id != null ? id : -1,
                name != null ? name : "",
                color != null ? color : "#ffffff"
        );
    }
}
