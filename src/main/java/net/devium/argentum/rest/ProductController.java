package net.devium.argentum.rest;

import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.jpa.ProductRepository;
import net.devium.argentum.rest.model.ProductRequest;
import net.devium.argentum.rest.model.ProductResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@ExposesResourceFor(ProductEntity.class)
@RequestMapping("/products")
public class ProductController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProductRepository productRepository;
    private final ProductRangeRepository productRangeRepository;

    @Autowired
    public ProductController(ProductRepository productRepository, ProductRangeRepository productRangeRepository) {
        this.productRepository = productRepository;
        this.productRangeRepository = productRangeRepository;
    }

    @RequestMapping(path = "/{product_id}", method = RequestMethod.GET)
    public ProductResponse getProduct(@PathVariable("product_id") long productId) {
        ProductEntity product = productRepository.findOne(productId);
        if (product == null) {
            LOGGER.info("Product with ID {} not found.", productId);
            throw new ResourceNotFoundException();
        }
        List<String> rangeIds = product.getProductRanges().stream()
                .map(ProductRangeEntity::getId)
                .collect(Collectors.toList());
        return new ProductResponse(product.getId(), product.getName(), product.getPrice(), rangeIds);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ProductResponse createProduct(@RequestBody ProductRequest product) {
        List<String> unknownRanges = product.getRanges().stream()
                .filter(rangeId -> !productRangeRepository.exists(rangeId))
                .collect(Collectors.toList());
        if (!unknownRanges.isEmpty()) {
            String message = String.format("Product range(s) %s not found.", unknownRanges);
            throw new ResourceNotFoundException(message);
        }

        List<ProductRangeEntity> ranges = product.getRanges().stream()
                .map(productRangeRepository::findOne)
                .collect(Collectors.toList());
        ProductEntity newProduct = new ProductEntity(product.getName(), product.getPrice(), ranges);
        productRepository.save(newProduct);

        return new ProductResponse(newProduct.getId(), newProduct.getName(), newProduct.getPrice(),
                product.getRanges());
    }

    @RequestMapping(path = "/{product_id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteProduct(@PathVariable("product_id") long productId) {
        try {
            productRepository.delete(productId);
        } catch (EmptyResultDataAccessException e) {
            LOGGER.info("Product with ID {} not found.", productId, e);
            throw new ResourceNotFoundException();
        }

        return ResponseEntity.noContent().build();
    }
}
