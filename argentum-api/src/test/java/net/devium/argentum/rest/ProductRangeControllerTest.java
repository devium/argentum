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
import java.util.List;

import static org.hamcrest.Matchers.*;
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
        ProductRangeEntity range1 = new ProductRangeEntity("someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherName");
        productRangeRepository.save(range1);
        productRangeRepository.save(range2);

        mockMvc.perform(get("/product_ranges"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id", is((int) range1.getId())))
                .andExpect(jsonPath("$.data[0].name", is("someName")))
                .andExpect(jsonPath("$.data[1].id", is((int) range2.getId())))
                .andExpect(jsonPath("$.data[1].name", is("someOtherName")));
    }

    @Test
    public void testGetProductRange() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someName");
        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50),
                Collections.singletonList(range));
        ProductEntity product2 = new ProductEntity("someOtherProduct", new BigDecimal(8.20),
                ImmutableList.of(range));
        productRangeRepository.save(range);
        productRepository.save(product1);
        productRepository.save(product2);

        mockMvc.perform(get("/product_ranges/{id}", range.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is((int) range.getId())))
                .andExpect(jsonPath("$.data.name", is("someName")))
                .andExpect(jsonPath("$.data.products", hasSize(2)))
                .andExpect(jsonPath("$.data.products[0].name", is("someProduct")))
                .andExpect(jsonPath("$.data.products[1].name", is("someOtherProduct")));
    }

    @Test
    public void testGetProductRangeNotFound() throws Exception {
        mockMvc.perform(get("/product_ranges/1"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateProductRange() throws Exception {
        String body = "{ 'name': 'someName' }";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/product_ranges")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk());

        List<ProductRangeEntity> ranges = productRangeRepository.findAll();
        assertEquals(1, ranges.size());
        assertEquals("someName", ranges.get(0).getName());
        assertTrue(ranges.get(0).getProducts().isEmpty());
    }

    @Test
    public void testDeleteProductRange() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someName");
        range = productRangeRepository.save(range);

        mockMvc.perform(delete("/product_ranges/{id}", range.getId()))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertFalse(productRangeRepository.exists(range.getId()));
    }

    @Test
    public void testDeleteProductRangeNotFound() throws Exception {
        mockMvc.perform(delete("/product_ranges/1"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteProductRanges() throws Exception {
        ProductRangeEntity range1 = new ProductRangeEntity("someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherName");
        ProductRangeEntity range3 = new ProductRangeEntity("someThirdName");
        range1 = productRangeRepository.save(range1);
        range2 = productRangeRepository.save(range2);
        range3 = productRangeRepository.save(range3);

        String body = String.format("[ %s, %s ]", range1.getId(), range2.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(delete("/product_ranges")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(productRangeRepository.findAll(), hasSize(1));
        assertThat(productRangeRepository.findOne(range3.getId()), notNullValue());
    }

    @Test
    public void testDeleteProductEmpty() throws Exception {
        String body = "[]";

        mockMvc.perform(delete("/product_ranges")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteProductRangesNotFound() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someName");
        range = productRangeRepository.save(range);

        String body = String.format("[ %s, %s ]", range.getId(), range.getId() + 1);
        body = body.replace('\'', '"');

        mockMvc.perform(delete("/product_ranges")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}