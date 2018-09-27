package net.devium.argentum.rest;

import net.devium.argentum.jpa.CategoryEntity;
import net.devium.argentum.jpa.CategoryRepository;
import net.devium.argentum.jpa.ProductEntity;
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
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CategoryControllerTest {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;

    private CategoryController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new CategoryController(categoryRepository, productRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    public void testGetCategories() throws Exception {
        CategoryEntity category1 = new CategoryEntity("someCategory", "#443322");
        CategoryEntity category2 = new CategoryEntity("someOtherCategory", "#112233");
        category1 = categoryRepository.save(category1);
        category2 = categoryRepository.save(category2);

        mockMvc.perform(get("/categories"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id", is((int) category1.getId())))
                .andExpect(jsonPath("$.data[0].name", is("someCategory")))
                .andExpect(jsonPath("$.data[0].color", is("#443322")))
                .andExpect(jsonPath("$.data[1].id", is((int) category2.getId())))
                .andExpect(jsonPath("$.data[1].name", is("someOtherCategory")))
                .andExpect(jsonPath("$.data[1].color", is("#112233")));
    }

    @Test
    public void testMergeCategories() throws Exception {
        CategoryEntity category1 = categoryRepository.save(new CategoryEntity("someCategory", "#778899"));
        String body = "[" +
                "   { 'id': %s, 'name': 'someUpdatedCategory', 'color': '#998877' }," +
                "   { 'name': 'someOtherCategory', 'color': '#112233' }," +
                "   { 'name': 'someThirdCategory', 'color': '#332211' }," +
                "   {}" +
                "]";
        body = String.format(body, category1.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/categories")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(categoryRepository.findAll(), hasSize(4));
        category1 = categoryRepository.findOne(category1.getId());
        assertThat(category1.getName(), is("someUpdatedCategory"));
        assertThat(category1.getColor(), is("#998877"));
    }

    @Test
    public void testMergeCategoriesEmpty() throws Exception {
        categoryRepository.save(new CategoryEntity("someCategory", "#778899"));
        String body = "[]";

        mockMvc.perform(post("/categories")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(categoryRepository.findAll(), hasSize(1));
    }

    @Test
    public void testDeleteCategories() throws Exception {
        CategoryEntity category1 = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        CategoryEntity category2 = categoryRepository.save(new CategoryEntity("someOtherCategory", "#332211"));
        CategoryEntity category3 = categoryRepository.save(new CategoryEntity("someThirdCategory", "#998877"));

        String body = String.format("[ %s, %s ]", category1.getId(), category2.getId());

        mockMvc.perform(delete("/categories")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(categoryRepository.findAll(), hasSize(1));
        assertThat(categoryRepository.findOne(category3.getId()), notNullValue());
    }

    @Test
    public void testDeleteCategoriesEmpty() throws Exception {
        String body = "[]";

        mockMvc.perform(delete("/categories")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteCategoriesCascade() throws Exception {
        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        ProductEntity product = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                category,
                Collections.emptySet()
        ));

        String body = String.format("[ %s ]", category.getId());

        mockMvc.perform(delete("/categories")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(productRepository.findOne(product.getId()).getCategory(), nullValue());
    }
}
