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
    public List<String> getProductRanges() {
        return StreamSupport.stream(productRangeRepository.findAll().spliterator(), false)
                .map(ProductRangeEntity::getId)
                .collect(Collectors.toList());
    }

    @RequestMapping(path = "/{rangeId}", method = RequestMethod.GET)
    public ProductRangeResponse getProductRange(@PathVariable String rangeId) {
        ProductRangeEntity range = productRangeRepository.findOne(rangeId);
        if (range == null) {
            LOGGER.info("Product range with ID {} not found.", rangeId);
            throw new ResourceNotFoundException();
        }
        List<Long> productIds = range.getProducts().stream()
                .map(ProductEntity::getId)
                .collect(Collectors.toList());
        return new ProductRangeResponse(range.getId(), range.getName(), productIds);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> createProductRange(@RequestBody ProductRangeRequest range) {
        ProductRangeEntity newRange = new ProductRangeEntity(range.getId(), range.getName());
        productRangeRepository.save(newRange);

        return ResponseEntity.noContent().build();
    }

    @RequestMapping(path = "/{rangeId}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteProductRange(@PathVariable String rangeId) {
        try {
            productRangeRepository.delete(rangeId);
        } catch (EmptyResultDataAccessException e) {
            LOGGER.info("Product range with ID {} not found.", rangeId, e);
            throw new ResourceNotFoundException();
        }

        return ResponseEntity.noContent().build();
    }
}
