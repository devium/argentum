package net.devium.argentum.rest;

import com.google.common.collect.ImmutableList;
import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.jpa.ProductRepository;
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
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertFalse;
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
    private ProductRangeRepository productRangeRepository;

    private ProductController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new ProductController(productRepository, productRangeRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        productRepository.deleteAll();
        productRangeRepository.deleteAll();
    }

    @Test
    public void testGetProductsNotFound() throws Exception {
        mockMvc.perform(get("/products"))
                .andDo(print())
                .andExpect(status().isMethodNotAllowed());
    }

    @Test
    public void testGetProduct() throws Exception {
        ProductRangeEntity range1 = new ProductRangeEntity("someRange", "someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherRange", "someOtherName");
        productRangeRepository.save(range1);
        productRangeRepository.save(range2);
        List<ProductRangeEntity> ranges = ImmutableList.of(range1, range2);
        ProductEntity product = new ProductEntity("someProduct", new BigDecimal(3.50), ranges);
        long id = productRepository.save(product).getId();

        mockMvc.perform(get("/products/{id}", id))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is((int) id)))
                .andExpect(jsonPath("$.name", is("someProduct")))
                .andExpect(jsonPath("$.price", closeTo(3.5, 0.0001)))
                .andExpect(jsonPath("$.ranges", contains("someRange", "someOtherRange")));
    }

    @Test
    public void testGetProductNotFound() throws Exception {
        mockMvc.perform(get("/products/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateProduct() throws Exception {
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'ranges': [ 'someRange', 'someOtherRange' ] }";
        body = body.replace('\'', '"');

        ProductRangeEntity range1 = new ProductRangeEntity("someRange", "someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherRange", "someOtherName");
        productRangeRepository.save(range1);
        productRangeRepository.save(range2);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name", is("someProduct")))
                .andExpect(jsonPath("$.price", closeTo(3.5, 0.0001)))
                .andExpect(jsonPath("$.ranges", contains("someRange", "someOtherRange")));

        range1 = productRangeRepository.findOne("someRange");
        range2 = productRangeRepository.findOne("someRange");
        assertThat(range1.getProducts(), hasSize(1));
        assertThat(range2.getProducts(), hasSize(1));
    }

    @Test
    public void testCreateProductRangeNotFound() throws Exception {
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'ranges': [ 'someRange', 'someOtherRange' ] }";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteProduct() throws Exception {
        ProductRangeEntity range1 = new ProductRangeEntity("someRange", "someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherRange", "someOtherName");
        productRangeRepository.save(range1);
        productRangeRepository.save(range2);
        List<ProductRangeEntity> ranges = ImmutableList.of(range1, range2);
        ProductEntity product = new ProductEntity("someProduct", new BigDecimal(3.50), ranges);
        product = productRepository.save(product);

        mockMvc.perform(delete("/products/{id}", product.getId()))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertFalse(productRepository.exists(product.getId()));
    }

    @Test
    public void testDeleteProductNotFound() throws Exception {
        mockMvc.perform(delete("/products/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}