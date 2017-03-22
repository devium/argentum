package net.devium.argentum.rest.model;

public class ProductRangeResponseMeta {
    private int id;
    private String name;

    public ProductRangeResponseMeta() {
    }

    public ProductRangeResponseMeta(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
