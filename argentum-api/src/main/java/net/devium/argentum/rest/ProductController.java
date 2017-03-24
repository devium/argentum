package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.request.ProductRequest;
import net.devium.argentum.rest.model.response.ProductResponse;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.HashSet;
import java.util.LinkedList;
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

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> mergeProducts(@RequestBody List<ProductRequest> products) {
        List<Long> unknownCategories = new LinkedList<>();
        List<Long> unknownRanges = new LinkedList<>();
        List<ProductEntity> mergedProducts = new LinkedList<>();

        // Find all unknown categories and ranges. Directly use known entities to initialize new product entities.
        for (ProductRequest product : products) {
            CategoryEntity category;
            if (product.getCategory() != null) {
                category = categoryRepository.findOne(product.getCategory());
                if (category == null) {
                    unknownCategories.add(product.getCategory());
                }
            } else {
                category = null;
            }

            Set<ProductRangeEntity> ranges = new HashSet<>();
            if (product.getRanges() != null) {
                for (Long rangeId : product.getRanges()) {
                    ProductRangeEntity range = productRangeRepository.findOne(rangeId);
                    if (range == null) {
                        unknownRanges.add(rangeId);
                    } else {
                        ranges.add(range);
                    }
                }
            }

            if (unknownCategories.isEmpty() && unknownRanges.isEmpty()) {
                mergedProducts.add(product.toEntity(category, ranges));
            }
        }

        // Compile error message for unknown categories and product ranges if there are any.
        String message = "";
        if (!unknownCategories.isEmpty()) {
            message += String.format("Category/ies %s not found. ", unknownCategories);
        }
        if (!unknownRanges.isEmpty()) {
            message += String.format("Product range(s) %s not found.", unknownRanges);
        }
        if (!message.isEmpty()) {
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        // Only merge if price and name are untouched. Create new products if not. Flag old ones as legacy.
        for (ProductEntity product : mergedProducts) {
            ProductEntity savedProduct = productRepository.findOne(product.getId());
            if (savedProduct == null) {
                continue;
            }

            if (!product.getName().equals(savedProduct.getName())
                    || product.getPrice().compareTo(savedProduct.getPrice()) != 0) {
                product.setId(-1);
                savedProduct.setLegacy(true);
                productRepository.save(savedProduct);
            }
        }

        // All categories and ranges are known. Updated products with changed name or price will be created anew.
        List<ProductResponse> response = productRepository.save(mergedProducts).stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> deleteProducts(@RequestBody List<Long> productIds) {
        List<Long> unknownProducts = new LinkedList<>();
        List<ProductEntity> products = new LinkedList<>();

        for (long productId : productIds) {
            ProductEntity product = productRepository.findOne(productId);
            if (product == null) {
                unknownProducts.add(productId);
            } else {
                products.add(product);
            }
        }

        if (!unknownProducts.isEmpty()) {
            String message = String.format("Product(s) %s not found.", unknownProducts);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        products.forEach(product -> product.setLegacy(true));
        productRepository.save(products);

        return ResponseEntity.noContent().build();
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
}
