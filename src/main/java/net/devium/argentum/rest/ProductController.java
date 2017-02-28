package net.devium.argentum.rest;

import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ExposesResourceFor(ProductEntity.class)
@RequestMapping("/products")
public class ProductController {
    private final ProductRepository repository;

    @Autowired
    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }
}
