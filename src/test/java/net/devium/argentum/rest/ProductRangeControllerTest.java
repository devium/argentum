package net.devium.argentum.rest;

import net.devium.argentum.model.ProductRange;
import net.devium.argentum.model.ProductRangeRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class ProductRangeControllerTest {
    @Mock
    private ProductRangeRepository productRangeRepository;

    private ProductRangeController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new ProductRangeController(productRangeRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @Test
    public void testGetProductRanges() throws Exception {
        when(productRangeRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/product_ranges"))
                .andExpect(status().isOk());

        verify(productRangeRepository).findAll();
    }

    @Test
    public void testCreateProductRange() throws Exception {
        String body = "{ 'id': 'someRange', 'name': 'someName' }";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/product_ranges")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andExpect(status().isNoContent());

        verify(productRangeRepository).save(new ProductRange("someRange", "someName"));
    }

    @Test
    public void testDeleteProductRange() throws Exception {
        when(productRangeRepository.findOne("someRange")).thenReturn(new ProductRange("someRange", "someName"));

        mockMvc.perform(delete("/product_ranges/someRange"))
                .andExpect(status().isNoContent());

        verify(productRangeRepository).delete("someRange");
    }

    @Test
    @SuppressWarnings("unchecked")
    public void testDeleteProductRangeNotFound() throws Exception {
        when(productRangeRepository.findOne("someRange")).thenThrow(EmptyResultDataAccessException.class);

        mockMvc.perform(delete("/product_ranges/someRange"))
                .andExpect(status().isNotFound());

        verify(productRangeRepository, Mockito.never()).delete("someRange");
    }
}