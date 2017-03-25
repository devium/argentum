package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;

import static org.hamcrest.Matchers.closeTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class StatisticsControllerTest {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductRangeRepository productRangeRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private GuestRepository guestRepository;

    private StatisticsController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new StatisticsController(orderRepository, productRepository, productRangeRepository,
                categoryRepository, guestRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        orderRepository.deleteAll();
        productRepository.deleteAll();
        productRangeRepository.deleteAll();
        categoryRepository.deleteAll();
        guestRepository.deleteAll();
    }

    @Test
    public void testGetStatistics() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, "12341234",
                new BigDecimal(3.50), new BigDecimal(10.00)
        ));
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, "12121212",
                new BigDecimal(1.20), new BigDecimal(0.00)
        ));
        GuestEntity guest3 = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", new Date(), null,
                new BigDecimal(0.50), new BigDecimal(2.00)
        ));

        CategoryEntity category1 = categoryRepository.save(new CategoryEntity("someCategory", "#443322"));
        CategoryEntity category2 = categoryRepository.save(new CategoryEntity("someOtherCategory", "#112233"));
        CategoryEntity category3 = categoryRepository.save(new CategoryEntity("someThirdCategory", "#778899"));
        CategoryEntity category4 = categoryRepository.save(new CategoryEntity("someFourthCategory", "#998877"));
        CategoryEntity category5 = categoryRepository.save(new CategoryEntity("someFifthCategory", "#666666"));

        ProductRangeEntity range1 = productRangeRepository.save(new ProductRangeEntity("someName"));
        ProductRangeEntity range2 = productRangeRepository.save(new ProductRangeEntity("someOtherName"));
        ProductRangeEntity range3 = productRangeRepository.save(new ProductRangeEntity("someThirdName"));
        ProductRangeEntity range4 = productRangeRepository.save(new ProductRangeEntity("someFourthName"));

        ProductEntity product1 = productRepository.save(new ProductEntity(
                "someProduct", new BigDecimal(2.50), null, Collections.emptySet()));
        ProductEntity product2 = productRepository.save(new ProductEntity(
                "someOtherProduct", new BigDecimal(6.75), null, Collections.emptySet()));
        ProductEntity product3 = productRepository.save(new ProductEntity(
                "someThirdProduct", new BigDecimal(2.50), null, Collections.emptySet()));
        ProductEntity product4 = productRepository.save(new ProductEntity(
                "someFourthProduct", new BigDecimal(6.75), null, Collections.emptySet()));
        ProductEntity product5 = productRepository.save(new ProductEntity(
                "someFifthProduct", new BigDecimal(2.50), null, Collections.emptySet()));
        ProductEntity product6 = productRepository.save(new ProductEntity(
                "someSixthProduct", new BigDecimal(6.75), null, Collections.emptySet()));

        OrderEntity order1 = orderRepository.save(new OrderEntity(guest1, new BigDecimal(4.30)));
        OrderEntity order2 = orderRepository.save(new OrderEntity(guest2, new BigDecimal(1.20)));
        OrderEntity order3 = orderRepository.save(new OrderEntity(guest3, new BigDecimal(6.10)));

        mockMvc.perform(get("/statistics"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.guestsTotal", is(3)))
                .andExpect(jsonPath("$.data.guestsCheckedIn", is(1)))
                .andExpect(jsonPath("$.data.cardsTotal", is(2)))
                .andExpect(jsonPath("$.data.totalBalance", closeTo(5.20, 0.001)))
                .andExpect(jsonPath("$.data.totalBonus", closeTo(12.00, 0.001)))
                .andExpect(jsonPath("$.data.totalSpent", closeTo(11.60, 0.001)))
                .andExpect(jsonPath("$.data.numProducts", is(6)))
                .andExpect(jsonPath("$.data.numRanges", is(4)))
                .andExpect(jsonPath("$.data.numCategories", is(5)));
    }
}
