package net.devium.argentum.rest.model;

public class ProductRangeResponseMeta {
    private long id;
    private String name;

    public ProductRangeResponseMeta() {
    }

    public ProductRangeResponseMeta(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
