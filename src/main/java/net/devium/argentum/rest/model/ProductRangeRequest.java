package net.devium.argentum.rest.model;

public class ProductRangeRequest {
    private String id;
    private String name;

    public ProductRangeRequest() {
    }

    public ProductRangeRequest(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
