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
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(4)))
                .andExpect(jsonPath("$.data[0].id", is((int) category1.getId())))
                .andExpect(jsonPath("$.data[0].name", is("someUpdatedCategory")))
                .andExpect(jsonPath("$.data[0].color", is("#998877")))
                .andExpect(jsonPath("$.data[1].id", notNullValue()))
                .andExpect(jsonPath("$.data[1].name", is("someOtherCategory")))
                .andExpect(jsonPath("$.data[1].color", is("#112233")))
                .andExpect(jsonPath("$.data[2].id", notNullValue()))
                .andExpect(jsonPath("$.data[2].name", is("someThirdCategory")))
                .andExpect(jsonPath("$.data[2].color", is("#332211")))
                .andExpect(jsonPath("$.data[3].id", notNullValue()))
                .andExpect(jsonPath("$.data[3].name", is("")))
                .andExpect(jsonPath("$.data[3].color", is("#ffffff")));

        assertThat(categoryRepository.findAll(), hasSize(4));
        category1 = categoryRepository.findOne(category1.getId());
        assertThat(category1.getName(), is("someUpdatedCategory"));
        assertThat(category1.getColor(), is("#998877"));
    }
}
