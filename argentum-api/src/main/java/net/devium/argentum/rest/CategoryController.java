package net.devium.argentum.rest;

import net.devium.argentum.jpa.CategoryEntity;
import net.devium.argentum.jpa.CategoryRepository;
import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRepository;
import net.devium.argentum.rest.model.request.CategoryRequest;
import net.devium.argentum.rest.model.response.CategoryResponse;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private CategoryRepository categoryRepository;
    private ProductRepository productRepository;

    @Autowired
    public CategoryController(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getCategories() {
        List<CategoryResponse> categories = categoryRepository.findAll().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());

        return Response.ok(categories);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> mergeCategories(@RequestBody List<CategoryRequest> categories) {
        List<CategoryEntity> mergedCategories = categories.stream()
                .map(CategoryRequest::toEntity)
                .collect(Collectors.toList());

        List<CategoryResponse> response = categoryRepository.save(mergedCategories).stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @Transactional
    public ResponseEntity<?> deleteCategories(@RequestBody List<Long> categoryIds) {
        if (categoryIds.isEmpty()) {
            String message = "No categories to delete.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        Set<Long> unknownCategories = new HashSet<>();
        Set<CategoryEntity> categories = new HashSet<>();

        for (long categoryId : categoryIds) {
            CategoryEntity category = categoryRepository.findOne(categoryId);

            if (category == null) {
                unknownCategories.add(categoryId);
            } else {
                categories.add(category);
            }
        }

        if (!unknownCategories.isEmpty()) {
            String message = String.format("Category/ies %s not found.", unknownCategories);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        // Remove from products. Products own the relationship so this has to be done explicitly. Makes for easier
        // product creation and modification though.
        Set<ProductEntity> modifiedProducts = categories.stream()
                .map(CategoryEntity::getProducts)
                .flatMap(Set::stream)
                .collect(Collectors.toSet());

        modifiedProducts.forEach(product -> product.setCategory(null));

        productRepository.save(modifiedProducts);
        categoryRepository.delete(categories);

        return ResponseEntity.noContent().build();
    }
}
