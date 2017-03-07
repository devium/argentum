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
import java.util.Collections;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ProductRangeControllerTest {
    @Autowired
    private ProductRangeRepository productRangeRepository;

    @Autowired
    private ProductRepository productRepository;

    private ProductRangeController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new ProductRangeController(productRangeRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        productRepository.deleteAll();
        productRangeRepository.deleteAll();
    }

    @Test
    public void testGetProductRanges() throws Exception {
        ProductRangeEntity range1 = new ProductRangeEntity("someRange", "someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherRange", "someOtherName");
        productRangeRepository.save(range1);
        productRangeRepository.save(range2);

        mockMvc.perform(get("/product_ranges"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0]", is("someRange")))
                .andExpect(jsonPath("$.[1]", is("someOtherRange")));
    }

    @Test
    public void testGetProductRange() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someRange", "someName");
        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50),
                Collections.singletonList(range));
        ProductEntity product2 = new ProductEntity("someOtherProduct", new BigDecimal(8.20),
                ImmutableList.of(range));
        productRangeRepository.save(range);
        productRepository.save(product1);
        productRepository.save(product2);

        mockMvc.perform(get("/product_ranges/someRange"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is("someRange")))
                .andExpect(jsonPath("$.name", is("someName")))
                .andExpect(jsonPath("$.products", hasSize(2)))
                .andExpect(jsonPath("$.products[0].name", is("someProduct")))
                .andExpect(jsonPath("$.products[1].name", is("someOtherProduct")));
    }

    @Test
    public void testGetProductRangeNotFound() throws Exception {
        mockMvc.perform(get("/product_ranges/someRange"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateProductRange() throws Exception {
        String body = "{ 'id': 'someRange', 'name': 'someName' }";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/product_ranges")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        ProductRangeEntity range = productRangeRepository.findOne("someRange");
        assertEquals("someName", range.getName());
        assertTrue(range.getProducts().isEmpty());
    }

    @Test
    public void testDeleteProductRange() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someRange", "someName");
        productRangeRepository.save(range);

        mockMvc.perform(delete("/product_ranges/someRange"))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertFalse(productRangeRepository.exists("someRange"));
    }

    @Test
    public void testDeleteProductRangeNotFound() throws Exception {
        mockMvc.perform(delete("/product_ranges/someRange"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}