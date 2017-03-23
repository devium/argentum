package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.CategoryEntity;

public class CategoryRequest {
    private String name;
    private String color;

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public CategoryEntity toEntity() {
        return new CategoryEntity(
                name,
                color
        );
    }
}
