package net.devium.argentum.rest;

import com.google.common.collect.ImmutableList;
import net.devium.argentum.jpa.ProductEntity;
import net.devium.argentum.jpa.ProductRangeEntity;
import net.devium.argentum.jpa.ProductRangeRepository;
import net.devium.argentum.jpa.ProductRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.hamcrest.Matchers.contains;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebAppConfiguration
public class ProductControllerTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductRangeRepository productRangeRepository;

    private ProductController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new ProductController(productRepository, productRangeRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @Test
    public void testGetProductsNotFound() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isMethodNotAllowed());

        verifyZeroInteractions(productRepository);
        verifyZeroInteractions(productRangeRepository);
    }

    @Test
    public void testGetProduct() throws Exception {
        List<ProductRangeEntity> ranges = ImmutableList.of(
                new ProductRangeEntity("someRange", "someName"),
                new ProductRangeEntity("someOtherRange", "someOtherName")
        );
        ProductEntity product = new ProductEntity("someProduct", new BigDecimal(3.50), ranges);
        product.setId(123L);
        when(productRepository.findOne(123L)).thenReturn(product);

        mockMvc.perform(get("/products/123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(123)))
                .andExpect(jsonPath("$.name", is("someProduct")))
                .andExpect(jsonPath("$.price", closeTo(3.5, 0.0001)))
                .andExpect(jsonPath("$.ranges", hasSize(2)))
                .andExpect(jsonPath("$.ranges", contains("someRange", "someOtherRange")));
    }

    @Test
    public void testGetProductNotFound() throws Exception {
        mockMvc.perform(get("/products/123"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateProduct() throws Exception {
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'ranges': [ 'someRange', 'someOtherRange' ] }";
        body = body.replace('\'', '"');

        when(productRangeRepository.exists("someRange")).thenReturn(true);
        when(productRangeRepository.exists("someOtherRange")).thenReturn(true);
        ProductRangeEntity range1 = new ProductRangeEntity("someRange", "someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherRange", "someOtherName");
        when(productRangeRepository.findOne("someRange")).thenReturn(range1);
        when(productRangeRepository.findOne("someOtherRange")).thenReturn(range2);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name", is("someProduct")))
                .andExpect(jsonPath("$.price", closeTo(3.5, 0.0001)))
                .andExpect(jsonPath("$.ranges", hasSize(2)))
                .andExpect(jsonPath("$.ranges", contains("someRange", "someOtherRange")));

        List<ProductRangeEntity> ranges = ImmutableList.of(range1, range2);
        ProductEntity product = new ProductEntity("someProduct", new BigDecimal(3.5), ranges);
        verify(productRepository).save(product);
    }

    @Test
    public void testCreateProductRangeNotFound() throws Exception {
        String body = "{ 'name': 'someProduct', 'price': 3.5, 'ranges': [ 'someRange', 'someOtherRange' ] }";
        body = body.replace('\'', '"');

        when(productRangeRepository.exists("someRange")).thenReturn(false);
        when(productRangeRepository.exists("someOtherRange")).thenReturn(false);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteProduct() throws Exception {
        mockMvc.perform(delete("/products/123"))
                .andExpect(status().isNoContent());

        verify(productRepository).delete(123L);
    }

    @Test
    public void testDeleteProductNotFound() throws Exception {
        doThrow(EmptyResultDataAccessException.class).when(productRepository).delete(123L);

        mockMvc.perform(delete("/products/123"))
                .andExpect(status().isNotFound());

        verify(productRepository).delete(123L);
    }
}