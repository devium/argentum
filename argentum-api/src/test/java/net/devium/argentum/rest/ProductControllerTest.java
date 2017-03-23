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

    @Test
    public void testCreateProduct() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductRangeEntity range2 = productRangeRepository.save(new ProductRangeEntity("someOtherName"));

        String body = "{ 'name': 'someProduct', 'price': 3.5, 'category': %s, 'ranges': [ %s, %s ] }";
        body = String.format(body, category.getId(), range1.getId(), range2.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.name", is("someProduct")))
                .andExpect(jsonPath("$.data.price", closeTo(3.5, 0.0001)))
                .andExpect(jsonPath("$.data.category", is((int) category.getId())))
                .andExpect(jsonPath("$.data.ranges", contains((int) range1.getId(), (int) range2.getId())));

        range1 = productRangeRepository.findOne(range1.getId());
        range2 = productRangeRepository.findOne(range2.getId());
        assertThat(range1.getProducts(), hasSize(1));
        assertThat(range2.getProducts(), hasSize(1));
    }

    @Test
    public void testCreateProductRangeNotFound() throws Exception {
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
    public void testCreateProductCategoryNotFound() throws Exception {
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'category': 1, 'ranges': [] }";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteProduct() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductRangeEntity range2 = productRangeRepository.save(new ProductRangeEntity("someOtherName"));

        List<ProductRangeEntity> ranges = ImmutableList.of(range1, range2);
        ProductEntity product = new ProductEntity("someProduct", new BigDecimal(3.50), category, ranges);
        product = productRepository.save(product);

        mockMvc.perform(delete("/products/{id}", product.getId()))
                .andDo(print())
                .andExpect(status().isNoContent());

        product = productRepository.findOne(product.getId());
        assertThat(product, notNullValue());
        assertThat(product.isLegacy(), is(true));
    }

    @Test
    public void testDeleteProductNotFound() throws Exception {
        mockMvc.perform(delete("/products/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}