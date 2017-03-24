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
import java.util.Collections;
import java.util.Date;

import static junit.framework.TestCase.assertTrue;
import static net.devium.argentum.ApplicationConstants.DECIMAL_PLACES;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    private OrderController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new OrderController(orderRepository, productRepository, productRangeRepository, orderItemRepository,
                guestRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        orderRepository.deleteAll();
        orderItemRepository.deleteAll();
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

        OrderEntity order1 = orderRepository.save(new OrderEntity(guest, new BigDecimal(19.75)));
        orderItemRepository.save(new OrderItemEntity(product1, 2, order1));
        orderItemRepository.save(new OrderItemEntity(product2, 3, order1));
        OrderEntity order2 = orderRepository.save(new OrderEntity(guest, new BigDecimal(4.25)));
        orderItemRepository.save(new OrderItemEntity(product1, 1, order2));

        mockMvc.perform(get("/orders"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].guestId", is((int) guest.getId())))
                .andExpect(jsonPath("$.data[0].items", hasSize(2)))
                .andExpect(jsonPath("$.data[0].items[0].productId").isNumber())
                .andExpect(jsonPath("$.data[0].items[0].quantity").isNumber())
                .andExpect(jsonPath("$.data[0].items[1].productId").isNumber())
                .andExpect(jsonPath("$.data[0].items[1].quantity").isNumber())
                .andExpect(jsonPath("$.data[0].total", closeTo(19.75, 0.001)))
                .andExpect(jsonPath("$.data[1].guestId", is((int) guest.getId())))
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

        OrderEntity order = orderRepository.save(new OrderEntity(guest, new BigDecimal(7.00)));
        orderItemRepository.save(new OrderItemEntity(product, 2, order));

        mockMvc.perform(get("/orders/{id}", order.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is((int) order.getId())))
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
                ImmutableSet.of(range));

        product = productRepository.save(product);

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
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.guestId", is((int) guest.getId())))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productId", is((int) product.getId())))
                .andExpect(jsonPath("$.data.items[0].quantity", is(2)))
                .andExpect(jsonPath("$.data.total", closeTo(7.00, 0.001)));

        assertThat(orderRepository.findAll(), hasSize(1));
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
                Collections.emptySet());

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
                Collections.emptySet());
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
                Collections.emptySet());
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(0.00),
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
        assertThat(guest.getBalance(), is(new BigDecimal(0.00).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest.getBonus(), is(new BigDecimal(0.20).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }

    @Test
    public void testCreateOrderBalanceAndBonusPayed() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet());
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
        assertThat(guest.getBonus(), is(new BigDecimal(0.00).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }

    @Test
    public void testCreateOrderInsufficientFunds() throws Exception {
        ProductEntity product = new ProductEntity(
                "someProduct",
                new BigDecimal(3.50),
                null,
                Collections.emptySet());
        product = productRepository.save(product);

        GuestEntity guest = new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                new Date(),
                "someCard",
                new BigDecimal(2.50),
                new BigDecimal(2.20)
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
}
