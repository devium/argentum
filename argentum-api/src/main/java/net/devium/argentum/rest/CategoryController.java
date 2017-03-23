package net.devium.argentum.rest;

import net.devium.argentum.jpa.CategoryEntity;
import net.devium.argentum.jpa.CategoryRepository;
import net.devium.argentum.rest.model.request.CategoryRequest;
import net.devium.argentum.rest.model.response.CategoryResponse;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private CategoryRepository categoryRepository;

    @Autowired
    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getCategories() {
        List<CategoryResponse> categories = categoryRepository.findAll().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());

        return Response.ok(categories);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> mergeCategories(@RequestBody List<CategoryRequest> categories) {
        List<CategoryEntity> mergedCategories = categories.stream()
                .map(CategoryRequest::toEntity)
                .collect(Collectors.toList());

        List<CategoryResponse> response = categoryRepository.save(mergedCategories).stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }
}
