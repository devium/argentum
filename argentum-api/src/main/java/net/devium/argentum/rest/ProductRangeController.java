package net.devium.argentum.rest;

import net.devium.argentum.jpa.ProductRangeEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.rest.model.request.ProductRangeRequest;
import net.devium.argentum.rest.model.response.ProductRangeResponseEager;
import net.devium.argentum.rest.model.response.ProductRangeResponseMeta;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/product_ranges")
public class ProductRangeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProductRangeRepository productRangeRepository;

    @Autowired
    public ProductRangeController(ProductRangeRepository productRangeRepository) {
        this.productRangeRepository = productRangeRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getProductRanges() {
        List<ProductRangeResponseMeta> response = productRangeRepository.findAll().stream()
                .map(ProductRangeResponseMeta::from)
                .collect(Collectors.toList());

        return Response.ok(response);
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

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> createProductRange(@RequestBody ProductRangeRequest range) {
        ProductRangeEntity newRange = new ProductRangeEntity(range.getName());
        newRange = productRangeRepository.save(newRange);

        return Response.ok(ProductRangeResponseEager.from(newRange));
    }

    @RequestMapping(path = "/{rangeId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteProductRange(@PathVariable long rangeId) {
        try {
            productRangeRepository.delete(rangeId);
        } catch (EmptyResultDataAccessException e) {
            String message = String.format("Product range %s not found.", rangeId);
            LOGGER.info(message, e);
            return Response.notFound(message);
        }

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> deleteProductRanges(@RequestBody LinkedList<Long> rangeIds) {
        if (rangeIds.isEmpty()) {
            String message = "No ranges to delete.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        List<Long> unknownRanges = rangeIds.stream()
                .filter(rangeId -> !productRangeRepository.exists(rangeId))
                .collect(Collectors.toList());

        if (!unknownRanges.isEmpty()) {
            String message = String.format("Product range(s) %s not found.", unknownRanges);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        rangeIds.forEach(productRangeRepository::delete);

        return ResponseEntity.noContent().build();
    }
}
