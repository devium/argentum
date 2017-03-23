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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
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

    @RequestMapping(path = "/{productId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<ProductResponse> getProduct(@PathVariable long productId) {
        ProductEntity product = productRepository.findOne(productId);

        if (product == null) {
            LOGGER.info("Product with ID {} not found.", productId);
            throw new ResourceNotFoundException();
        }

        List<Integer> rangeIds = product.getProductRanges().stream()
                .map(ProductRangeEntity::getId)
                .collect(Collectors.toList());

        ProductResponse response = new ProductResponse(product.getId(), product.getName(), product.getPrice(),
                rangeIds);
        return ResponseEntity.ok(response);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest product) {
        Set<Integer> unknownRanges = product.getRanges().stream()
                .filter(rangeId -> !productRangeRepository.exists(rangeId))
                .collect(Collectors.toSet());

        if (!unknownRanges.isEmpty()) {
            String message = String.format("Product range(s) %s not found.", unknownRanges);
            throw new ResourceNotFoundException(message);
        }

        List<ProductRangeEntity> ranges = product.getRanges().stream()
                .map(productRangeRepository::findOne)
                .collect(Collectors.toList());

        ProductEntity newProduct = new ProductEntity(product.getName(), product.getPrice(), ranges);
        productRepository.save(newProduct);

        ProductResponse response = new ProductResponse(newProduct.getId(), newProduct.getName(), newProduct.getPrice(),
                product.getRanges());
        return ResponseEntity.ok(response);
    }

    @RequestMapping(path = "/{productId}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteProduct(@PathVariable long productId) {
        try {
            productRepository.delete(productId);
        } catch (EmptyResultDataAccessException e) {
            LOGGER.info("Product with ID {} not found.", productId, e);
            throw new ResourceNotFoundException();
        }

        return ResponseEntity.noContent().build();
    }
}
