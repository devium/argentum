package net.devium.argentum.rest;

import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.jpa.ProductRepository;
import net.devium.argentum.rest.model.request.ProductRangeRequest;
import net.devium.argentum.rest.model.response.ProductRangeResponseEager;
import net.devium.argentum.rest.model.response.ProductRangeResponseMeta;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/product_ranges")
public class ProductRangeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProductRangeRepository productRangeRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ProductRangeController(ProductRangeRepository productRangeRepository, ProductRepository productRepository) {
        this.productRangeRepository = productRangeRepository;
        this.productRepository = productRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getProductRanges() {
        List<ProductRangeResponseMeta> response = productRangeRepository.findAll().stream()
                .map(ProductRangeResponseMeta::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> mergeProductRanges(@RequestBody List<ProductRangeRequest> ranges) {
        List<ProductRangeEntity> mergedRanges = ranges.stream()
                .map(ProductRangeRequest::toEntity)
                .collect(Collectors.toList());

        List<ProductRangeResponseMeta> response = productRangeRepository.save(mergedRanges).stream()
                .map(ProductRangeResponseMeta::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> deleteProductRanges(@RequestBody List<Long> rangeIds) {
        if (rangeIds.isEmpty()) {
            String message = "No ranges to delete.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        List<Long> unknownRanges = new LinkedList<>();
        Set<ProductRangeEntity> ranges = new HashSet<>();

        for (long rangeId : rangeIds) {
            ProductRangeEntity range = productRangeRepository.findOne(rangeId);

            if (range == null) {
                unknownRanges.add(rangeId);
            } else {
                ranges.add(range);
            }
        }

        if (!unknownRanges.isEmpty()) {
            String message = String.format("Product range(s) %s not found.", unknownRanges);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        // Remove from products. Products own the relationship so this has to be done explicitly. Makes for easier
        // product creation and modification though.
        Set<ProductEntity> modifiedProducts = ranges.stream()
                .map(ProductRangeEntity::getProducts)
                .flatMap(Set::stream)
                .collect(Collectors.toSet());

        modifiedProducts.forEach(product -> product.removeProductRanges(ranges));

        productRepository.save(modifiedProducts);
        productRangeRepository.delete(ranges);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(path = "/{rangeId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getProductRange(@PathVariable long rangeId) {
        ProductRangeEntity range = productRangeRepository.findOne(rangeId);

        if (range == null) {
            String message = String.format("Product range with ID %s not found.", rangeId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        return Response.ok(ProductRangeResponseEager.from(range));
    }
}
