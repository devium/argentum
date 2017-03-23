package net.devium.argentum.rest.model;

import net.devium.argentum.jpa.ProductRangeEntity;

import java.util.List;
import java.util.stream.Collectors;

public class ProductRangeResponseEager {
    private final long id;
    private final String name;
    private final List<ProductResponseMeta> products;

    private ProductRangeResponseEager(long id, String name, List<ProductResponseMeta> products) {
        this.id = id;
        this.name = name;
        this.products = products;
    }

    public static ProductRangeResponseEager from(ProductRangeEntity range) {
        return new ProductRangeResponseEager(
                range.getId(),
                range.getName(),
                range.getProducts().stream().map(ProductResponseMeta::from).collect(Collectors.toList())
        );
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<ProductResponseMeta> getProducts() {
        return products;
    }
}
