package net.devium.argentum.rest.model;

import java.util.List;

public class ProductRangeResponseEager {
    private int id;
    private String name;
    private List<ProductResponseMeta> products;

    public ProductRangeResponseEager() {
    }

    public ProductRangeResponseEager(int id, String name, List<ProductResponseMeta> products) {
        this.id = id;
        this.name = name;
        this.products = products;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<ProductResponseMeta> getProducts() {
        return products;
    }
}
