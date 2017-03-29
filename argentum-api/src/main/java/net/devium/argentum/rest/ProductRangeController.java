package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.request.ProductRangeRequest;
import net.devium.argentum.rest.model.response.ProductRangeResponseEager;
import net.devium.argentum.rest.model.response.ProductRangeResponseMeta;
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
@RequestMapping("/ranges")
public class ProductRangeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProductRangeRepository productRangeRepository;
    private final ProductRepository productRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProductRangeController(ProductRangeRepository productRangeRepository, ProductRepository productRepository,
                                  RoleRepository roleRepository, UserRepository userRepository) {
        this.productRangeRepository = productRangeRepository;
        this.productRepository = productRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
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
    @Transactional
    public ResponseEntity<?> mergeProductRanges(@RequestBody List<ProductRangeRequest> ranges) {
        List<ProductRangeEntity> mergedRanges = ranges.stream()
                .map(ProductRangeRequest::toEntity)
                .collect(Collectors.toList());

        Set<Long> existingRangeIds = mergedRanges.stream()
                .filter(range -> range.getId() > 0)
                .map(ProductRangeEntity::getId)
                .collect(Collectors.toSet());

        mergedRanges = productRangeRepository.save(mergedRanges);

        List<RoleEntity> newRoles = new LinkedList<>();
        mergedRanges.stream()
                .map(ProductRangeEntity::getId)
                .filter(rangeId -> !existingRangeIds.contains(rangeId))
                .forEach(rangeId -> newRoles.add(new RoleEntity(String.format("RANGE_%s", rangeId))));

        roleRepository.save(newRoles);

        List<ProductRangeResponseMeta> response = mergedRanges.stream()
                .map(ProductRangeResponseMeta::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> deleteProductRanges(@RequestBody List<Long> rangeIds) {
        if (rangeIds.isEmpty()) {
            String message = "No ranges to delete.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        Set<Long> unknownRanges = new HashSet<>();
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

        // Remove associated roles.
        List<String> roleNames = ranges.stream()
                .map(range -> String.format("RANGE_%s", range.getId()))
                .collect(Collectors.toList());

        List<RoleEntity> roles = roleRepository.findByNameIn(roleNames);

        // Unlink users from roles.
        Set<UserEntity> modifiedUsers = roles.stream()
                .map(RoleEntity::getUsers)
                .flatMap(Set::stream)
                .collect(Collectors.toSet());

        modifiedUsers.forEach(user -> user.removeRoles(roles));

        userRepository.save(modifiedUsers);
        roleRepository.delete(roles);
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
