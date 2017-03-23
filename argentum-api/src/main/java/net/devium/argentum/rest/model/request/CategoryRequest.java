package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.CategoryEntity;

public class CategoryRequest {
    // PUT only, ignored on POST
    private long id;
    private String name;
    private String color;

    public long getId() {
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
                id,
                name != null ? name : "",
                color != null ? color : "#ffffff"
        );
    }
}
