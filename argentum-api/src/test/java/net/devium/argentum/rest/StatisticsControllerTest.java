package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
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
import java.util.Date;

import static org.hamcrest.Matchers.closeTo;
import static org.hamcrest.Matchers.hasSize;
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
    private OrderItemRepository orderItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductRangeRepository productRangeRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private GuestRepository guestRepository;
    @Autowired
    private BalanceEventRepository balanceEventRepository;

    private StatisticsController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new StatisticsController(
                orderRepository,
                productRepository,
                productRangeRepository,
                categoryRepository,
                guestRepository,
                balanceEventRepository,
                orderItemRepository
        );
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        orderRepository.deleteAll();
        orderItemRepository.deleteAll();
        productRepository.deleteAll();
        productRangeRepository.deleteAll();
        categoryRepository.deleteAll();
        balanceEventRepository.deleteAll();
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
                new BigDecimal(-0.50), new BigDecimal(2.00)
        ));

        balanceEventRepository.save(new BalanceEventEntity(guest1, new Date(), new BigDecimal(10.00), "balance"));
        balanceEventRepository.save(new BalanceEventEntity(guest1, new Date(), new BigDecimal(2.50), "balance"));
        balanceEventRepository.save(new BalanceEventEntity(guest1, new Date(), new BigDecimal(-6.50), "balance"));
        balanceEventRepository.save(new BalanceEventEntity(guest2, new Date(), new BigDecimal(15.50), "balance"));
        balanceEventRepository.save(new BalanceEventEntity(guest3, new Date(), new BigDecimal(-1.50), "balance"));

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
                "someProduct", new BigDecimal(2.50), category1, ImmutableSet.of(range1)
        ));
        ProductEntity product2 = productRepository.save(new ProductEntity(
                "someOtherProduct", new BigDecimal(6.75), category2, ImmutableSet.of(range1, range2)
        ));
        ProductEntity product3 = productRepository.save(new ProductEntity(
                "someThirdProduct", new BigDecimal(2.50), category1, ImmutableSet.of(range1)
        ));
        ProductEntity product4 = productRepository.save(new ProductEntity(
                "someFourthProduct", new BigDecimal(6.75), category3, true, ImmutableSet.of(range1, range2, range3)
        ));
        ProductEntity product5 = productRepository.save(new ProductEntity(
                "someFifthProduct", new BigDecimal(2.50), category5, ImmutableSet.of(range4)
        ));
        ProductEntity product6 = productRepository.save(new ProductEntity(
                "someSixthProduct", new BigDecimal(6.75), category1, true, ImmutableSet.of(range1)
        ));

        OrderEntity order1 = orderRepository.save(new OrderEntity(guest1, new Date(), new BigDecimal(22.50))); // +1.50
        OrderEntity order2 = orderRepository.save(new OrderEntity(guest2, new Date(), new BigDecimal(3.00)));  // +0.50
        OrderEntity order3 = orderRepository.save(new OrderEntity(guest3, new Date(), new BigDecimal(17.00))); // +1.00

        OrderItemEntity orderItem1 = orderItemRepository.save(new OrderItemEntity(product2, 2, order1)); // 13.50
        OrderItemEntity orderItem2 = orderItemRepository.save(new OrderItemEntity(product1, 3, order1)); //  7.50
        OrderItemEntity orderItem3 = orderItemRepository.save(new OrderItemEntity(product5, 1, order2)); //  2.50
        OrderItemEntity orderItem4 = orderItemRepository.save(new OrderItemEntity(product6, 2, order3)); // 13.50
        OrderItemEntity orderItem5 = orderItemRepository.save(new OrderItemEntity(product1, 1, order3)); //  2.50

        order1.setCustomCancelled(new BigDecimal(0.50));
        orderRepository.save(order1);
        balanceEventRepository.save(new BalanceEventEntity(guest1, new Date(), new BigDecimal(0.50), "refund"));

        orderItem2.setCancelled(1); // 2.50
        orderItemRepository.save(orderItem2);
        balanceEventRepository.save(new BalanceEventEntity(guest1, new Date(), new BigDecimal(2.50), "refund"));

        orderItem4.setCancelled(2); // 13.50
        orderItemRepository.save(orderItem4);
        balanceEventRepository.save(new BalanceEventEntity(guest3, new Date(), new BigDecimal(13.50), "refund"));

        order3.setCustomCancelled(new BigDecimal(1.00));
        orderRepository.save(order3);
        balanceEventRepository.save(new BalanceEventEntity(guest3, new Date(), new BigDecimal(1.00), "refund"));

        mockMvc.perform(get("/statistics"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.guestsTotal", is(3)))
                .andExpect(jsonPath("$.data.guestsCheckedIn", is(1)))
                .andExpect(jsonPath("$.data.cardsTotal", is(2)))
                .andExpect(jsonPath("$.data.totalPositiveBalance", closeTo(4.70, 0.001)))
                .andExpect(jsonPath("$.data.totalNegativeBalance", closeTo(0.50, 0.001)))
                .andExpect(jsonPath("$.data.totalBonus", closeTo(12.00, 0.001)))
                .andExpect(jsonPath("$.data.totalSpent", closeTo(42.50, 0.001)))
                .andExpect(jsonPath("$.data.totalRefund", closeTo(17.50, 0.001)))
                .andExpect(jsonPath("$.data.totalDeposited", closeTo(28.00, 0.001)))
                .andExpect(jsonPath("$.data.totalWithdrawn", closeTo(8.00, 0.001)))
                .andExpect(jsonPath("$.data.numProducts", is(6)))
                .andExpect(jsonPath("$.data.numLegacyProducts", is(2)))
                .andExpect(jsonPath("$.data.numRanges", is(4)))
                .andExpect(jsonPath("$.data.numCategories", is(5)))
                .andExpect(jsonPath("$.data.quantitySales", hasSize(3)))
                .andExpect(jsonPath("$.data.quantitySales[0].product", is((int)product1.getId())))
                .andExpect(jsonPath("$.data.quantitySales[0].quantity", is(3)))
                .andExpect(jsonPath("$.data.quantitySales[1].product", is((int)product2.getId())))
                .andExpect(jsonPath("$.data.quantitySales[1].quantity", is(2)))
                .andExpect(jsonPath("$.data.quantitySales[2].product", is((int)product5.getId())))
                .andExpect(jsonPath("$.data.quantitySales[2].quantity", is(1)));
    }
}
