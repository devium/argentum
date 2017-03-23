package net.devium.argentum.rest;

import com.google.common.collect.ImmutableList;
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
import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertFalse;
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
    private ProductRepository productRepository;
    @Autowired
    private ProductRangeRepository productRangeRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    private OrderController sut;

    private MockMvc mockMvc;

    private List<OrderEntity> saveOrders() {
        ProductRangeEntity range1 = new ProductRangeEntity("someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherName");
        range1 = productRangeRepository.save(range1);
        range2 = productRangeRepository.save(range2);

        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50),
                Collections.singletonList(range1));
        ProductEntity product2 = new ProductEntity("someOtherProduct", new BigDecimal(8.20),
                Collections.singletonList(range2));
        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);

        OrderEntity order1 = new OrderEntity(new BigDecimal(7.00));
        OrderEntity order2 = new OrderEntity(new BigDecimal(19.90));
        order1 = orderRepository.save(order1);
        order2 = orderRepository.save(order2);

        OrderItemEntity orderItem1 = new OrderItemEntity(product1, 2, order1);
        OrderItemEntity orderItem2 = new OrderItemEntity(product1, 1, order2);
        OrderItemEntity orderItem3 = new OrderItemEntity(product2, 2, order2);
        orderItemRepository.save(orderItem1);
        orderItemRepository.save(orderItem2);
        orderItemRepository.save(orderItem3);

        // Find again for updated relationship references.
        order1 = orderRepository.findOne(order1.getId());
        order2 = orderRepository.findOne(order2.getId());

        return ImmutableList.of(order1, order2);
    }

    @Before
    public void setUp() {
        sut = new OrderController(orderRepository, productRepository, productRangeRepository, orderItemRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        orderRepository.deleteAll();
        orderItemRepository.deleteAll();
        productRepository.deleteAll();
        productRangeRepository.deleteAll();
    }

    @Test
    public void testGetOrders() throws Exception {
        saveOrders();

        mockMvc.perform(get("/orders"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void testGetOrder() throws Exception {
        List<OrderEntity> orders = saveOrders();

        mockMvc.perform(get("/orders/{id}", orders.get(0).getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is((int) orders.get(0).getId())))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.total", closeTo(7.00, 0.001)))
                .andExpect(jsonPath("$.data.items[0].productId",
                        is((int) orders.get(0).getOrderItems().get(0).getProduct().getId())))
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
        ProductRangeEntity range = new ProductRangeEntity("someName");
        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50),
                Collections.singletonList(range));
        ProductEntity product2 = new ProductEntity("someOtherProduct", new BigDecimal(5.80),
                Collections.singletonList(range));
        productRangeRepository.save(range);
        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);

        String body = "{" +
                "   'items': [" +
                "       { 'productId': %d, 'quantity': 2 }," +
                "       { 'productId': %d, 'quantity': 1 }" +
                "   ]" +
                "}";
        body = String.format(body, product1.getId(), product2.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.items[0].productId", is((int) product1.getId())))
                .andExpect(jsonPath("$.data.items[0].quantity", is(2)))
                .andExpect(jsonPath("$.data.items[1].productId", is((int) product2.getId())))
                .andExpect(jsonPath("$.data.items[1].quantity", is(1)))
                .andExpect(jsonPath("$.data.total", closeTo(12.80, 0.001)));

        assertFalse(orderRepository.findAll().isEmpty());
    }

    @Test
    public void testCreateOrderProductNotFound() throws Exception {
        String body = "{" +
                "   'items': [" +
                "       { 'productId': %d, 'quantity': 2 }," +
                "       { 'productId': %d, 'quantity': 1 }" +
                "   ]" +
                "}";
        body = String.format(body, 1, 2);
        body = body.replace('\'', '"');

        mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());

        assertTrue(orderRepository.findAll().isEmpty());
    }
}
