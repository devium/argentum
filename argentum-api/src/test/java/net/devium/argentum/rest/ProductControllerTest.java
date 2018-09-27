package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ProductControllerTest {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRangeRepository productRangeRepository;

    private ProductController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new ProductController(productRepository, categoryRepository, productRangeRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        productRangeRepository.deleteAll();
    }

    @Test
    public void testGetProducts() throws Exception {
        CategoryEntity category1 = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        CategoryEntity category2 = categoryRepository.save(new CategoryEntity("someOtherCategory", "#332211"));

        ProductEntity product1 = new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                category1,
                Collections.emptySet());
        ProductEntity product2 = new ProductEntity(
                "someOtherProduct",
                new BigDecimal(3.50),
                category2,
                Collections.emptySet());
        ProductEntity product3 = new ProductEntity(
                "someThirdProduct",
                new BigDecimal(4.50),
                category1,
                Collections.emptySet());
        product3.setLegacy(true);

        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);
        productRepository.save(product3);

        mockMvc.perform(get("/products"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id", is((int) product1.getId())))
                .andExpect(jsonPath("$.data[0].price", closeTo(2.50, 0.001)))
                .andExpect(jsonPath("$.data[0].category", is((int) category1.getId())))
                .andExpect(jsonPath("$.data[0].ranges", is(Collections.emptyList())))
                .andExpect(jsonPath("$.data[0].legacy", is(false)))
                .andExpect(jsonPath("$.data[1].id", is((int) product2.getId())))
                .andExpect(jsonPath("$.data[1].price", closeTo(3.50, 0.001)))
                .andExpect(jsonPath("$.data[1].category", is((int) category2.getId())))
                .andExpect(jsonPath("$.data[1].ranges", is(Collections.emptyList())))
                .andExpect(jsonPath("$.data[1].legacy", is(false)));
    }

    @Test
    public void testMergeProducts() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductRangeEntity range2 = productRangeRepository.save(new ProductRangeEntity("someOtherName"));
        ProductEntity product1 = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                category,
                ImmutableSet.of(range1)));
        ProductEntity product2 = productRepository.save(new ProductEntity(
                "yetSomeOtherProduct",
                new BigDecimal(6.75),
                null,
                ImmutableSet.of(range1, range2)));

        String body = "[" +
                // product1 has its name and price updated. Should create a new product.
                "   { 'id': %1$s, 'name': 'someUpdatedProduct', 'price': 2.25, 'ranges': [%5$s] }," +
                // product2 only has its category and range updated. Should update the old product.
                "   { 'id': %2$s, 'name': 'yetSomeOtherProduct', 'price': 6.75, 'category': %3$s, 'ranges': [%4$s] }," +
                "   { 'name': 'someOtherProduct', 'price': 3.5, 'category': %3$s, 'ranges': [ %4$s, %5$s ] }," +
                "   { 'name': 'someThirdProduct', 'price': 4.75, 'category': null, 'ranges': [] }," +
                "   {}" +
                "]";
        body = String.format(body,
                             product1.getId(), product2.getId(), category.getId(), range1.getId(), range2.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        range1 = productRangeRepository.findOne(range1.getId());
        range2 = productRangeRepository.findOne(range2.getId());
        // Including legacy products (old product1).
        assertThat(range1.getProducts(), hasSize(3));
        assertThat(range2.getProducts(), hasSize(2));
        assertThat(productRepository.findOne(product1.getId()).isLegacy(), is(true));
    }

    @Test
    public void testMergeProductsEmpty() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductEntity product1 = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                category,
                ImmutableSet.of(range1)
        ));

        String body = "[]";

        mockMvc.perform(post("/products")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        range1 = productRangeRepository.findOne(range1.getId());
        assertThat(range1.getProducts(), hasSize(1));
    }

    @Test
    public void testMergeProductsCategoryNotFound() throws Exception {
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'category': 1, 'ranges': [] }";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMergeProductsRangeNotFound() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'category': %s, 'ranges': [ 1, 2 ] }";
        body = String.format(body, category.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMergeProductsNoRangeOrphanDeletion() throws Exception {
        ProductRangeEntity range = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductEntity product = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                null,
                ImmutableSet.of(range)));

        String body = "[ { 'id': %s, 'name': 'someProduct', 'price': 2.50, 'ranges': [] } ]";
        body = String.format(body, product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(productRangeRepository.findAll(), hasSize(1));
        assertThat(productRangeRepository.findOne(range.getId()), notNullValue());
    }

    @Test
    public void testMergeProductsNoCategoryOrphanDeletion() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        ProductEntity product = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                category,
                Collections.emptySet()));

        String body = "[ { 'id': %s, 'name': 'someProduct', 'price': 2.50, 'category': null } ]";
        body = String.format(body, product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(categoryRepository.findAll(), hasSize(1));
        assertThat(categoryRepository.findOne(category.getId()), notNullValue());
    }

    @Test
    public void testDeleteProducts() throws Exception {
        ProductEntity product1 = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                null,
                Collections.emptySet()));
        ProductEntity product2 = productRepository.save(new ProductEntity(
                "someOtherProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()));

        String body = "[ %s ]";
        body = String.format(body, product2.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(delete("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(productRepository.findAll(), hasSize(2));
        assertThat(productRepository.findOne(product1.getId()).isLegacy(), is(false));
        assertThat(productRepository.findOne(product2.getId()).isLegacy(), is(true));
    }

    @Test
    public void testDeleteProductsNotFound() throws Exception {
        String body = "[ 1, 2 ]";

        mockMvc.perform(delete("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetProduct() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductRangeEntity range2 = productRangeRepository.save(new ProductRangeEntity("someOtherName"));

        Set<ProductRangeEntity> ranges = ImmutableSet.of(range1, range2);
        ProductEntity product = new ProductEntity("someProduct", new BigDecimal(3.50), category, ranges);
        long id = productRepository.save(product).getId();

        mockMvc.perform(get("/products/{id}", id))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is((int) id)))
                .andExpect(jsonPath("$.data.name", is("someProduct")))
                .andExpect(jsonPath("$.data.price", closeTo(3.5, 0.0001)))
                .andExpect(jsonPath("$.data.category", is((int) category.getId())))
                .andExpect(jsonPath("$.data.legacy", is(false)))
                .andExpect(jsonPath("$.data.ranges", containsInAnyOrder((int) range1.getId(), (int) range2.getId())));
    }

    @Test
    public void testGetProductNotFound() throws Exception {
        mockMvc.perform(get("/products/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}