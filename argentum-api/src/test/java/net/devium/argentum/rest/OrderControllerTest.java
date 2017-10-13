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
import java.math.RoundingMode;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class OrderControllerTest {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductRangeRepository productRangeRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private GuestRepository guestRepository;
    @Autowired
    private ConfigRepository configRepository;
    @Autowired
    private BalanceEventRepository balanceEventRepository;

    private OrderController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new OrderController(
                orderRepository,
                productRepository,
                productRangeRepository,
                orderItemRepository,
                balanceEventRepository,
                guestRepository,
                configRepository
        );
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        configRepository.deleteAll();
        orderRepository.deleteAll();
        orderItemRepository.deleteAll();
        balanceEventRepository.deleteAll();
        guestRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        productRangeRepository.deleteAll();
    }

    @Test
    public void testGetOrders() throws Exception {
        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(32.40),
                new BigDecimal(50.10)
        );
        guest = guestRepository.save(guest);
        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50), null, Collections.emptySet());
        ProductEntity product2 = new ProductEntity("someProduct", new BigDecimal(4.25), null, Collections.emptySet());
        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);

        OrderEntity order1 = orderRepository.save(new OrderEntity(guest, new Date(), new BigDecimal(19.75)));
        orderItemRepository.save(new OrderItemEntity(product1, 2, order1));
        orderItemRepository.save(new OrderItemEntity(product2, 3, order1));
        OrderEntity order2 = orderRepository.save(new OrderEntity(guest, new Date(), new BigDecimal(4.25)));
        orderItemRepository.save(new OrderItemEntity(product1, 1, order2));

        mockMvc.perform(get("/orders"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id", is((int) order1.getId())))
                .andExpect(jsonPath("$.data[0].time", notNullValue()))
                .andExpect(jsonPath("$.data[0].guest.id", is((int) guest.getId())))
                .andExpect(jsonPath("$.data[0].items", hasSize(2)))
                .andExpect(jsonPath("$.data[0].items[0].productId").isNumber())
                .andExpect(jsonPath("$.data[0].items[0].quantity").isNumber())
                .andExpect(jsonPath("$.data[0].items[1].productId").isNumber())
                .andExpect(jsonPath("$.data[0].items[1].quantity").isNumber())
                .andExpect(jsonPath("$.data[0].total", closeTo(19.75, 0.001)))
                .andExpect(jsonPath("$.data[1].id", is((int) order2.getId())))
                .andExpect(jsonPath("$.data[1].time", notNullValue()))
                .andExpect(jsonPath("$.data[1].guest.id", is((int) guest.getId())))
                .andExpect(jsonPath("$.data[1].items", hasSize(1)))
                .andExpect(jsonPath("$.data[1].items[0].productId").isNumber())
                .andExpect(jsonPath("$.data[1].items[0].quantity").isNumber())
                .andExpect(jsonPath("$.data[1].total", closeTo(4.25, 0.001)));
    }

    @Test
    public void testGetOrder() throws Exception {
        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(32.40),
                new BigDecimal(50.10)
        );
        guest = guestRepository.save(guest);
        ProductEntity product = new ProductEntity("someProduct", new BigDecimal(3.50), null, Collections.emptySet());
        product = productRepository.save(product);

        OrderEntity order = orderRepository.save(new OrderEntity(guest, new Date(), new BigDecimal(7.00)));
        orderItemRepository.save(new OrderItemEntity(product, 2, order));

        mockMvc.perform(get("/orders/{id}", order.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is((int) order.getId())))
                .andExpect(jsonPath("$.data.time", notNullValue()))
                .andExpect(jsonPath("$.data.total", closeTo(7.00, 0.001)))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productId", is((int) product.getId())))
                .andExpect(jsonPath("$.data.items[0].quantity", is(2)));
    }

    @Test
    public void testGetOrderNotFound() throws Exception {
        mockMvc.perform(get("/orders/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateOrder() throws Exception {
        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(32.40),
                new BigDecimal(50.10)
        );
        guest = guestRepository.save(guest);

        CategoryEntity category = categoryRepository.save(new CategoryEntity("someCategory", "#112233"));

        ProductRangeEntity range = productRangeRepository.save(new ProductRangeEntity("someName"));

        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                category,
                ImmutableSet.of(range)
        );

        product = productRepository.save(product);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': [" +
                "       { 'productId': %s, 'quantity': 2 }" +
                "   ]," +
                "   'customTotal': 3.20" +
                "}";
        body = String.format(body, guest.getId(), product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.time", notNullValue()))
                .andExpect(jsonPath("$.data.guest.id", is((int) guest.getId())))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productId", is((int) product.getId())))
                .andExpect(jsonPath("$.data.items[0].quantity", is(2)))
                .andExpect(jsonPath("$.data.total", closeTo(10.20, 0.001)));

        assertThat(orderRepository.findAll(), hasSize(1));
    }

    @Test
    public void testCreateOrderEqual() throws Exception {
        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(5.00),
                BigDecimal.ZERO
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': []," +
                "   'customTotal': 5.00" +
                "}";
        body = String.format(body, guest.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.time", notNullValue()))
                .andExpect(jsonPath("$.data.guest.id", is((int) guest.getId())))
                .andExpect(jsonPath("$.data.items", empty()))
                .andExpect(jsonPath("$.data.total", closeTo(5.00, 0.001)));

        assertThat(orderRepository.findAll(), hasSize(1));
    }

    @Test
    public void testCreateOrderClose() throws Exception {
        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(5.00),
                BigDecimal.ZERO
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': []," +
                "   'customTotal': 5.001" +
                "}";
        body = String.format(body, guest.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.time", notNullValue()))
                .andExpect(jsonPath("$.data.guest.id", is((int) guest.getId())))
                .andExpect(jsonPath("$.data.items", empty()))
                .andExpect(jsonPath("$.data.total", closeTo(5.00, 0.001)));

        assertThat(orderRepository.findAll(), hasSize(1));
    }

    @Test
    public void testCreateOrderPostpaid() throws Exception {
        configRepository.save(new ConfigEntity("postpaidLimit", "10"));

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(3.00),
                new BigDecimal(1.00)
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': []," +
                "   'customTotal': 6.20" +
                "}";
        body = String.format(body, guest.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.time", notNullValue()))
                .andExpect(jsonPath("$.data.guest.id", is((int) guest.getId())))
                .andExpect(jsonPath("$.data.items", empty()))
                .andExpect(jsonPath("$.data.total", closeTo(6.20, 0.001)));

        guest = guestRepository.findOne(guest.getId());
        assertThat(orderRepository.findAll(), hasSize(1));
        assertThat(guest.getBalance(), is(new BigDecimal(-2.20).setScale(DECIMAL_PLACES, RoundingMode.HALF_UP)));
        assertThat(guest.getBonus(), is(BigDecimal.ZERO.setScale(DECIMAL_PLACES, RoundingMode.HALF_UP)));
    }

    @Test
    public void testCreateOrderPostpaidExceeded() throws Exception {
        configRepository.save(new ConfigEntity("postpaidLimit", "2"));

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(3.00),
                new BigDecimal(1.00)
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': []," +
                "   'customTotal': 6.20" +
                "}";
        body = String.format(body, guest.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());

        guest = guestRepository.findOne(guest.getId());
        assertThat(orderRepository.findAll(), hasSize(0));
        assertThat(guest.getBalance(), is(new BigDecimal(3.00).setScale(DECIMAL_PLACES, RoundingMode.HALF_UP)));
        assertThat(guest.getBonus(), is(new BigDecimal(1.00).setScale(DECIMAL_PLACES, RoundingMode.HALF_UP)));
    }

    @Test
    public void testCreateOrderProductNotFound() throws Exception {
        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(32.40),
                new BigDecimal(50.10)
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': [" +
                "       { 'productId': 1, 'quantity': 2 }," +
                "       { 'productId': 2, 'quantity': 1 }" +
                "   ]" +
                "}";
        body = String.format(body, guest.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());

        assertTrue(orderRepository.findAll().isEmpty());
    }

    @Test
    public void testCreateOrderGuestNull() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );

        product = productRepository.save(product);

        String body = "{" +
                "   'items': [" +
                "       { 'productId': %s, 'quantity': 2 }" +
                "   ]" +
                "}";
        body = String.format(body, product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());

        assertTrue(orderRepository.findAll().isEmpty());
    }

    @Test
    public void testCreateOrderGuestNotFound() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );
        product = productRepository.save(product);

        String body = "{" +
                "   'guestId': 1," +
                "   'items': [" +
                "       { 'productId': %s, 'quantity': 2 }" +
                "   ]" +
                "}";
        body = String.format(body, product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());

        assertTrue(orderRepository.findAll().isEmpty());
    }

    @Test
    public void testCreateOrderBonusPayed() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                BigDecimal.ZERO,
                new BigDecimal(7.20)
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': [" +
                "       { 'productId': %s, 'quantity': 2 }" +
                "   ]" +
                "}";
        body = String.format(body, guest.getId(), product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isOk());

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getBalance(), is(BigDecimal.ZERO.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest.getBonus(), is(new BigDecimal(0.20).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }

    @Test
    public void testCreateOrderBalanceAndBonusPayed() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(2.50),
                new BigDecimal(5.20)
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': [" +
                "       { 'productId': %s, 'quantity': 2 }" +
                "   ]" +
                "}";
        body = String.format(body, guest.getId(), product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isOk());

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getBalance(), is(new BigDecimal(0.70).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest.getBonus(), is(BigDecimal.ZERO.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }

    @Test
    public void testCreateOrderInsufficientFunds() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(4.50),
                new BigDecimal(2.49)
        );
        guest = guestRepository.save(guest);

        String body = "{" +
                "   'guestId': %s," +
                "   'items': [" +
                "       { 'productId': %s, 'quantity': 2 }" +
                "   ]" +
                "}";
        body = String.format(body, guest.getId(), product.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testCancelOrderItems() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(4.50),
                new BigDecimal(2.49)
        );
        guest = guestRepository.save(guest);

        OrderEntity order = new OrderEntity(guest, new Date(), new BigDecimal(7.50));
        order = orderRepository.save(order);

        OrderItemEntity orderItem = new OrderItemEntity(product, 2, order);
        orderItem = orderItemRepository.save(orderItem);

        String body = "[" +
                "   {" +
                "       'id': %s," +
                "       'cancelled': 1" +
                "   }," +
                "   {" +
                "       'id': %s," +
                "       'customTotal': 0.20" +
                "   }" +
                "]";
        body = String.format(body, orderItem.getId(), order.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(
                delete("/orders")
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .content(body)
        )
                .andDo(print())
                .andExpect(status().isNoContent());

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getBalance(), is(new BigDecimal(8.20).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest.getBonus(), is(new BigDecimal(2.49).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));

        orderItem = orderItemRepository.findOne(orderItem.getId());
        assertThat(orderItem.getCancelled(), is(1));

        order = orderRepository.findOne(order.getId());
        assertThat(
                order.getCustomCancelled(), is(new BigDecimal(0.20).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP))
        );

        List<BalanceEventEntity> balanceEvents = balanceEventRepository.findAll();
        assertThat(balanceEvents, hasSize(2));

        // Order: custom refunds are performed first.
        BalanceEventEntity balanceEvent1 = balanceEvents.get(0);
        assertThat(balanceEvent1.getGuest(), is(guest));
        assertThat(balanceEvent1.getTime(), notNullValue());
        assertThat(
                balanceEvent1.getValue(), is(new BigDecimal(0.20).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP))
        );
        assertThat(balanceEvent1.getDescription(), is("refund"));

        BalanceEventEntity balanceEvent2 = balanceEvents.get(1);
        assertThat(balanceEvent2.getGuest(), is(guest));
        assertThat(balanceEvent2.getTime(), notNullValue());
        assertThat(
                balanceEvent2.getValue(), is(new BigDecimal(3.50).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP))
        );
        assertThat(balanceEvent2.getDescription(), is("refund"));
    }

    @Test
    public void testCancelOrderItemsCapped() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(4.50),
                new BigDecimal(2.49)
        );
        guest = guestRepository.save(guest);

        OrderEntity order = new OrderEntity(guest, new Date(), new BigDecimal(7.50));
        order = orderRepository.save(order);

        OrderItemEntity orderItem = new OrderItemEntity(product, 2, order);
        orderItem = orderItemRepository.save(orderItem);

        String body = "[" +
                "   {" +
                "       'id': %s," +
                "       'cancelled': 3" +
                "   }," +
                "   {" +
                "       'id': %s," +
                "       'customTotal': 0.70" +
                "   }" +
                "]";
        body = String.format(body, orderItem.getId(), order.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(
                delete("/orders")
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .content(body)
        )
                .andDo(print())
                .andExpect(status().isNoContent());

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getBalance(), is(new BigDecimal(12.00).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest.getBonus(), is(new BigDecimal(2.49).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));

        orderItem = orderItemRepository.findOne(orderItem.getId());
        assertThat(orderItem.getCancelled(), is(2));

        order = orderRepository.findOne(order.getId());
        assertThat(
                order.getCustomCancelled(), is(new BigDecimal(0.50).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP))
        );
    }

    @Test
    public void testCancelOrderItemsAlreadyPartial() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet()
        );
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(4.50),
                new BigDecimal(2.49)
        );
        guest = guestRepository.save(guest);

        OrderEntity order = new OrderEntity(guest, new Date(), new BigDecimal(7.50));
        order.setCustomCancelled(new BigDecimal(0.10));
        order = orderRepository.save(order);

        OrderItemEntity orderItem = new OrderItemEntity(product, 2, order);
        orderItem.setCancelled(1);
        orderItem = orderItemRepository.save(orderItem);

        String body = "[" +
                "   {" +
                "       'id': %s," +
                "       'cancelled': 2" +
                "   }," +
                "   {" +
                "       'id': %s," +
                "       'customTotal': 0.40" +
                "   }" +
                "]";
        body = String.format(body, orderItem.getId(), order.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(
                delete("/orders")
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .content(body)
        )
                .andDo(print())
                .andExpect(status().isNoContent());

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getBalance(), is(new BigDecimal(8.30).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest.getBonus(), is(new BigDecimal(2.49).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));

        orderItem = orderItemRepository.findOne(orderItem.getId());
        assertThat(orderItem.getCancelled(), is(2));

        order = orderRepository.findOne(order.getId());
        assertThat(
                order.getCustomCancelled(), is(new BigDecimal(0.40).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP))
        );
    }
}
