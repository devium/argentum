package net.devium.argentum.rest;

import com.google.common.collect.ImmutableList;
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
import java.util.List;

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
                Collections.emptyList());
        ProductEntity product2 = new ProductEntity(
                "someOtherProduct",
                new BigDecimal(3.50),
                category2,
                Collections.emptyList());
        ProductEntity product3 = new ProductEntity(
                "someThirdProduct",
                new BigDecimal(4.50),
                category1,
                Collections.emptyList());
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
                Collections.singletonList(range1)));
        ProductEntity product2 = productRepository.save(new ProductEntity(
                "yetSomeOtherProduct",
                new BigDecimal(6.75),
                null,
                ImmutableList.of(range1, range2)));

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
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id", not((int) product1.getId())))
                .andExpect(jsonPath("$.data[0].name", is("someUpdatedProduct")))
                .andExpect(jsonPath("$.data[0].price", closeTo(2.25, 0.0001)))
                .andExpect(jsonPath("$.data[0].category", nullValue()))
                .andExpect(jsonPath("$.data[0].legacy", is(false)))
                .andExpect(jsonPath("$.data[0].ranges", contains((int) range2.getId())))
                .andExpect(jsonPath("$.data[1].id", is((int) product2.getId())))
                .andExpect(jsonPath("$.data[1].name", is("yetSomeOtherProduct")))
                .andExpect(jsonPath("$.data[1].price", closeTo(6.75, 0.0001)))
                .andExpect(jsonPath("$.data[1].category", is((int) category.getId())))
                .andExpect(jsonPath("$.data[1].legacy", is(false)))
                .andExpect(jsonPath("$.data[1].ranges", contains((int) range1.getId())))
                .andExpect(jsonPath("$.data[2].id").isNumber())
                .andExpect(jsonPath("$.data[2].name", is("someOtherProduct")))
                .andExpect(jsonPath("$.data[2].price", closeTo(3.5, 0.0001)))
                .andExpect(jsonPath("$.data[2].category", is((int) category.getId())))
                .andExpect(jsonPath("$.data[2].legacy", is(false)))
                .andExpect(jsonPath("$.data[2].ranges", contains((int) range1.getId(), (int) range2.getId())))
                .andExpect(jsonPath("$.data[3].id").isNumber())
                .andExpect(jsonPath("$.data[3].name", is("someThirdProduct")))
                .andExpect(jsonPath("$.data[3].price", closeTo(4.75, 0.0001)))
                .andExpect(jsonPath("$.data[3].category", nullValue()))
                .andExpect(jsonPath("$.data[3].legacy", is(false)))
                .andExpect(jsonPath("$.data[3].ranges", empty()))
                .andExpect(jsonPath("$.data[4].id").isNumber())
                .andExpect(jsonPath("$.data[4].name", is("")))
                // Should actually be closeTo(0.00) but Jayway is a bitch (type mismatch).
                .andExpect(jsonPath("$.data[4].price", is(0)))
                .andExpect(jsonPath("$.data[4].category", nullValue()))
                .andExpect(jsonPath("$.data[4].legacy", is(false)))
                .andExpect(jsonPath("$.data[4].ranges", empty()));

        range1 = productRangeRepository.findOne(range1.getId());
        range2 = productRangeRepository.findOne(range2.getId());
        // Including legacy products (old product1).
        assertThat(range1.getProducts(), hasSize(3));
        assertThat(range2.getProducts(), hasSize(2));
        assertThat(productRepository.findOne(product1.getId()).isLegacy(), is(true));
    }

    @Test
    public void testMergeProductCategoryNotFound() throws Exception {
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'category': 1, 'ranges': [] }";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMergeProductRangeNotFound() throws Exception {
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
    public void testDeleteProducts() throws Exception {
        ProductEntity product1 = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                null,
                Collections.emptyList()));
        ProductEntity product2 = productRepository.save(new ProductEntity(
                "someOtherProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptyList()));

        String body = "[ %s ]";
        body = String.format(body, product2.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(delete("/products/")
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

        mockMvc.perform(delete("/products/")
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

        List<ProductRangeEntity> ranges = ImmutableList.of(range1, range2);
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
                .andExpect(jsonPath("$.data.ranges", contains((int) range1.getId(), (int) range2.getId())));
    }

    @Test
    public void testGetProductNotFound() throws Exception {
        mockMvc.perform(get("/products/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}