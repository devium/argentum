package net.devium.argentum.rest.model;


import java.util.List;

public class ProductRangeResponse {
    private String id;
    private String name;
    private List<ProductResponseNoRange> products;

    public ProductRangeResponse() {
    }

    public ProductRangeResponse(String id, String name, List<ProductResponseNoRange> products) {
        this.id = id;
        this.name = name;
        this.products = products;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<ProductResponseNoRange> getProducts() {
        return products;
    }
}
