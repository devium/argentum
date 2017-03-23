package net.devium.argentum.rest;

import net.devium.argentum.jpa.CategoryRepository;
import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.jpa.ProductRepository;
import net.devium.argentum.rest.model.request.ProductRequest;
import net.devium.argentum.rest.model.response.ProductResponse;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final CategoryRepository categoryRepository;
    private final ProductRangeRepository productRangeRepository;

    @Autowired
    public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository,
                             ProductRangeRepository productRangeRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productRangeRepository = productRangeRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getProducts() {
        List<ProductResponse> products = productRepository.findAll().stream()
                .filter(product -> !product.isLegacy())
                .map(ProductResponse::from)
                .collect(Collectors.toList());

        return Response.ok(products);
    }

    @RequestMapping(path = "/{productId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getProduct(@PathVariable long productId) {
        ProductEntity product = productRepository.findOne(productId);

        if (product == null) {
            String message = String.format("Product with ID %s not found.", productId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        return Response.ok(ProductResponse.from(product));
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest product) {
        if (product.getCategory() != -1 && !categoryRepository.exists(product.getCategory())) {
            String message = String.format("Category %s not found.", product.getCategory());
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        Set<Long> unknownRanges = product.getRanges().stream()
                .filter(rangeId -> !productRangeRepository.exists(rangeId))
                .collect(Collectors.toSet());

        if (!unknownRanges.isEmpty()) {
            String message = String.format("Product range(s) %s not found.", unknownRanges);
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        ProductEntity newProduct = productRepository.save(product.toEntity(categoryRepository, productRangeRepository));
        return Response.ok(ProductResponse.from(newProduct));
    }

    @RequestMapping(path = "/{productId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteProduct(@PathVariable long productId) {
        ProductEntity product = productRepository.findOne(productId);

        if (product == null) {
            String message = String.format("Product with ID %s not found.", productId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        product.setLegacy(true);
        productRepository.save(product);

        return ResponseEntity.noContent().build();
    }
}
