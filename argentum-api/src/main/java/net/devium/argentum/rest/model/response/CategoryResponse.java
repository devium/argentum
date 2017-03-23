package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.CategoryEntity;

public class CategoryResponse {
    private final long id;
    private final String name;
    private final String color;

    private CategoryResponse(long id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public static CategoryResponse from(CategoryEntity category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getColor()
        );
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }
}
