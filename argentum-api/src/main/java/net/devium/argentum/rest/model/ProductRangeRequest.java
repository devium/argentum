package net.devium.argentum.rest.model;

public class ProductRangeRequest {
    private String name;

    public ProductRangeRequest() {
    }

    public ProductRangeRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
