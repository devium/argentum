package net.devium.argentum.rest.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductRangeRequest {
    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
