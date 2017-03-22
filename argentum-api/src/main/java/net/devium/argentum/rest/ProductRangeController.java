package net.devium.argentum.rest;

import net.devium.argentum.jpa.ProductRangeEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.rest.model.ProductRangeRequest;
import net.devium.argentum.rest.model.ProductRangeResponseEager;
import net.devium.argentum.rest.model.ProductRangeResponseMeta;
import net.devium.argentum.rest.model.ProductResponseMeta;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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
    public ResponseEntity<List<ProductRangeResponseMeta>> getProductRanges() {
        List<ProductRangeResponseMeta> response = StreamSupport.stream(productRangeRepository.findAll()
                .spliterator(), false)
                .map(range -> new ProductRangeResponseMeta(range.getId(), range.getName()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(path = "/{rangeId}", method = RequestMethod.GET)
    public ResponseEntity<ProductRangeResponseEager> getProductRange(@PathVariable Integer rangeId) {
        ProductRangeEntity range = productRangeRepository.findOne(rangeId);

        if (range == null) {
            LOGGER.info("Product range with ID {} not found.", rangeId);
            throw new ResourceNotFoundException();
        }

        List<ProductResponseMeta> products = range.getProducts().stream()
                .map(product -> new ProductResponseMeta(product.getId(), product.getName(), product.getPrice()))
                .collect(Collectors.toList());

        ProductRangeResponseEager response = new ProductRangeResponseEager(range.getId(), range.getName(), products);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<ProductRangeResponseMeta> createProductRange(@RequestBody ProductRangeRequest range) {
        ProductRangeEntity newRange = new ProductRangeEntity(range.getName());
        newRange = productRangeRepository.save(newRange);

        ProductRangeResponseMeta response = new ProductRangeResponseMeta(newRange.getId(), newRange.getName());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(path = "/{rangeId}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteProductRange(@PathVariable Integer rangeId) {
        try {
            productRangeRepository.delete(rangeId);
        } catch (EmptyResultDataAccessException e) {
            String message = String.format("Product range %s not found.", rangeId);
            LOGGER.info(message, e);
            throw new ResourceNotFoundException(message);
        }

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteProductRanges(List<Integer> rangeIds) {
        List<Integer> unknownRanges = rangeIds.stream()
                .filter(rangeId -> productRangeRepository.findOne(rangeId) == null)
                .collect(Collectors.toList());

        if (!unknownRanges.isEmpty()) {
            String message = String.format("Product range(s) %s not found.", unknownRanges);
            LOGGER.info(message);
            throw new ResourceNotFoundException(message);
        }

        unknownRanges.forEach(productRangeRepository::delete);

        return ResponseEntity.noContent().build();
    }
}
