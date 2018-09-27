package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
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
import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
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
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;

    private ProductRangeController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new ProductRangeController(productRangeRepository, productRepository, roleRepository, userRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        productRangeRepository.deleteAll();
        List<RoleEntity> rangeRoles = roleRepository.findByNameContains("RANGE\\_");
        roleRepository.delete(rangeRoles);
    }

    @Test
    public void testGetProductRanges() throws Exception {
        ProductRangeEntity range1 = new ProductRangeEntity("someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherName");
        productRangeRepository.save(range1);
        productRangeRepository.save(range2);

        mockMvc.perform(get("/ranges"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id", is((int) range1.getId())))
                .andExpect(jsonPath("$.data[0].name", is("someName")))
                .andExpect(jsonPath("$.data[1].id", is((int) range2.getId())))
                .andExpect(jsonPath("$.data[1].name", is("someOtherName")));
    }

    @Test
    public void testGetProductRangeNotFound() throws Exception {
        mockMvc.perform(get("/ranges/1"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testMergeProductRanges() throws Exception {
        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        RoleEntity role1 = roleRepository.save(new RoleEntity(String.format("RANGE_%s", range1.getId())));

        String body = "[" +
                "   { 'id': %s, 'name': 'someUpdatedName' }," +
                "   { 'name': 'someOtherName' }," +
                "   { 'name': 'someThirdName' }," +
                "   {}" +
                "]";
        body = String.format(body, range1.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/ranges")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        List<ProductRangeEntity> ranges = productRangeRepository.findAll();
        assertThat(ranges, hasSize(4));
        range1 = productRangeRepository.findOne(range1.getId());
        assertThat(range1.getName(), is("someUpdatedName"));

        List<RoleEntity> roles = roleRepository.findAll();
        assertThat(roles, hasSize(7 + 4));
        assertThat(roles.get(7).getName(), is(String.format("RANGE_%s", range1.getId())));
        assertThat(roles.get(8).getName(), is(String.format("RANGE_%s", ranges.get(1).getId())));
        assertThat(roles.get(9).getName(), is(String.format("RANGE_%s", ranges.get(2).getId())));
        assertThat(roles.get(10).getName(), is(String.format("RANGE_%s", ranges.get(3).getId())));
    }

    @Test
    public void testMergeProductRangesEmpty() throws Exception {
        productRangeRepository.save(new ProductRangeEntity("someName"));

        String body = "[]";

        mockMvc.perform(post("/ranges")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        List<ProductRangeEntity> ranges = productRangeRepository.findAll();
        assertThat(ranges, hasSize(1));
    }

    @Test
    public void testDeleteProductRanges() throws Exception {
        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductRangeEntity range2 = productRangeRepository.save(new ProductRangeEntity("someOtherName"));
        ProductRangeEntity range3 = productRangeRepository.save(new ProductRangeEntity("someThirdName"));
        RoleEntity role1 = roleRepository.save(new RoleEntity(String.format("RANGE_%s", range1.getId())));
        RoleEntity role2 = roleRepository.save(new RoleEntity(String.format("RANGE_%s", range2.getId())));
        RoleEntity role3 = roleRepository.save(new RoleEntity(String.format("RANGE_%s", range3.getId())));
        UserEntity user = userRepository.save(
                new UserEntity("someUser", "somePassword", ImmutableSet.of(role1, role2))
        );

        String body = String.format("[ %s, %s ]", range1.getId(), range2.getId());

        mockMvc.perform(delete("/ranges")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(productRangeRepository.findAll(), hasSize(1));
        assertThat(productRangeRepository.findOne(range3.getId()), notNullValue());

        List<RoleEntity> roles = roleRepository.findAll();
        assertThat(roles, hasSize(7 + 1));
        assertThat(roles.get(7).getName(), is(String.format("RANGE_%s", range3.getId())));
        assertThat(userRepository.findOne(user.getId()).getRoles(), empty());
        userRepository.delete(user.getId());
    }

    @Test
    public void testDeleteProductEmpty() throws Exception {
        productRangeRepository.save(new ProductRangeEntity("someName"));
        String body = "[]";

        mockMvc.perform(delete("/ranges")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(productRangeRepository.findAll(), hasSize(1));
    }

    @Test
    public void testDeleteProductRangesNotFound() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someName");
        range = productRangeRepository.save(range);

        String body = String.format("[ %s, %s ]", range.getId(), range.getId() + 1);

        mockMvc.perform(delete("/ranges")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteProductRangesCascade() throws Exception {
        ProductRangeEntity range = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductEntity product = productRepository.save(new ProductEntity(
                "someProduct",
                new BigDecimal(2.50),
                null,
                ImmutableSet.of(range)
        ));

        String body = String.format("[ %s ]", range.getId());

        mockMvc.perform(delete("/ranges")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(productRepository.findOne(product.getId()).getProductRanges(), empty());
    }

    @Test
    public void testGetRangeProducts() throws Exception {
        CategoryEntity category1 = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));
        CategoryEntity category2 = categoryRepository.save(new CategoryEntity("someOtherCategory", "#332211"));

        ProductRangeEntity range = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductEntity product1 = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                category1,
                ImmutableSet.of(range)
        );
        ProductEntity product2 = new ProductEntity(
                "someOtherProduct",
                new BigDecimal(8.20),
                category2,
                ImmutableSet.of(range)
        );

        productRepository.save(product1);
        productRepository.save(product2);

        mockMvc.perform(get("/ranges/{id}", range.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data", containsInAnyOrder(
                    ImmutableSet.of(hasEntry("id", (int)product1.getId()), hasEntry("id", (int)product2.getId()))
                )));
    }
}