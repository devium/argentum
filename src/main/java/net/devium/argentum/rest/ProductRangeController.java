package net.devium.argentum.rest;

import net.devium.argentum.model.ProductRange;
import net.devium.argentum.model.ProductRangeRepository;
import net.devium.argentum.rest.model.ProductRangeRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@ExposesResourceFor(ProductRange.class)
@RequestMapping("/product_ranges")
public class ProductRangeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProductRangeRepository repository;

    @Autowired
    public ProductRangeController(ProductRangeRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<String> getProductRanges() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .map(ProductRange::getId)
                .collect(Collectors.toList());
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> createProductRange(@RequestBody ProductRangeRequest range) {
        ProductRange newRange = new ProductRange(range.getId(), range.getName());
        repository.save(newRange);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(path = "/{product_id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteProductRange(@PathVariable("product_id") String productId) {
        try {
            ProductRange range = repository.findOne(productId);
            repository.delete(productId);
        } catch (EmptyResultDataAccessException e) {
            LOGGER.info("Product range with ID {} not found.", productId, e);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
