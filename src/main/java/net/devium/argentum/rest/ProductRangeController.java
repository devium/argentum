package net.devium.argentum.rest;

import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.rest.model.ProductRangeRequest;
import net.devium.argentum.rest.model.ProductRangeResponse;
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
import java.util.stream.StreamSupport;

@RestController
@ExposesResourceFor(ProductRangeEntity.class)
@RequestMapping("/product_ranges")
public class ProductRangeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProductRangeRepository repository;

    @Autowired
    public ProductRangeController(ProductRangeRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<String> getProductRanges() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .map(ProductRangeEntity::getId)
                .collect(Collectors.toList());
    }

    @RequestMapping(path = "/{range_id}", method = RequestMethod.GET)
    public ProductRangeResponse getProductRange(@PathVariable("range_id") String rangeId) {
        try {
            ProductRangeEntity range = repository.findOne(rangeId);
            List<Long> productIds = range.getProducts().stream()
                    .map(ProductEntity::getId)
                    .collect(Collectors.toList());
            return new ProductRangeResponse(range.getId(), range.getName(), productIds);
        } catch (EmptyResultDataAccessException e) {
            LOGGER.info("ProductEntity range with ID {} not found.", rangeId, e);
            throw new ResourceNotFoundException();
        }
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> createProductRange(@RequestBody ProductRangeRequest range) {
        ProductRangeEntity newRange = new ProductRangeEntity(range.getId(), range.getName());
        repository.save(newRange);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(path = "/{range_id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteProductRange(@PathVariable("range_id") String rangeId) {
        try {
            repository.delete(rangeId);
        } catch (EmptyResultDataAccessException e) {
            LOGGER.info("ProductEntity range with ID {} not found.", rangeId, e);
            throw new ResourceNotFoundException();
        }

        return ResponseEntity.noContent().build();
    }
}
