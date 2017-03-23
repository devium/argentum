package net.devium.argentum.rest;

import net.devium.argentum.jpa.CategoryEntity;
import net.devium.argentum.jpa.CategoryRepository;
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

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CategoryControllerTest {
    @Autowired
    private CategoryRepository categoryRepository;

    private CategoryController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new CategoryController(categoryRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
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
    public void testCreateCategories() throws Exception {
        String body = "[" +
                "   { 'name': 'someCategory', 'color': '#112233' }," +
                "   { 'name': 'someOtherCategory', 'color': '#332211' }" +
                "]";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id", notNullValue()))
                .andExpect(jsonPath("$.data[0].name", is("someCategory")))
                .andExpect(jsonPath("$.data[0].color", is("#112233")))
                .andExpect(jsonPath("$.data[1].id", notNullValue()))
                .andExpect(jsonPath("$.data[1].name", is("someOtherCategory")))
                .andExpect(jsonPath("$.data[1].color", is("#332211")));

        assertThat(categoryRepository.findAll(), hasSize(2));
    }
}
