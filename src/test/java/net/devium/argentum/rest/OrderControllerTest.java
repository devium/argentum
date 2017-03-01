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
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
        ProductRangeEntity range1 = new ProductRangeEntity("someRange", "someName");
        ProductRangeEntity range2 = new ProductRangeEntity("someOtherRange", "someOtherName");
        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50),
                Collections.singletonList(range1));
        ProductEntity product2 = new ProductEntity("someOtherProduct", new BigDecimal(8.20),
                Collections.singletonList(range2));
        OrderItemEntity orderItem1 = new OrderItemEntity(product1, 2);
        OrderItemEntity orderItem2 = new OrderItemEntity(product2, 1);
        OrderEntity order1 = new OrderEntity(range1, Collections.singletonList(orderItem1));
        OrderEntity order2 = new OrderEntity(range1, Collections.singletonList(orderItem1));
        productRangeRepository.save(range1);
        productRangeRepository.save(range2);
        productRepository.save(product1);
        productRepository.save(product2);
        orderItemRepository.save(orderItem1);
        orderItemRepository.save(orderItem2);

        return ImmutableList.of(orderRepository.save(order1), orderRepository.save(order2));
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
                .andExpect(jsonPath("$.range", is("someRange")));
    }

    @Test
    public void testGetOrderNotFound() throws Exception {
        mockMvc.perform(get("/orders/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateOrder() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someRange", "someName");
        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50),
                Collections.singletonList(range));
        ProductEntity product2 = new ProductEntity("someOtherProduct", new BigDecimal(5.80),
                Collections.singletonList(range));
        productRangeRepository.save(range);
        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);

        String body = "{" +
                "   'range': 'someRange'," +
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
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.range", is("someRange")))
                .andExpect(jsonPath("$.items[0].productId", is((int) product1.getId())))
                .andExpect(jsonPath("$.items[0].quantity", is(2)))
                .andExpect(jsonPath("$.items[1].productId", is((int) product2.getId())))
                .andExpect(jsonPath("$.items[1].quantity", is(1)));

        assertFalse(orderRepository.findAll().isEmpty());
    }

    @Test
    public void testCreateOrderProductNotFound() throws Exception {
        String body = "{" +
                "   'range': 'someRange'," +
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

    @Test
    public void testCreateOrderProductNotInRange() throws Exception {
        ProductRangeEntity range = new ProductRangeEntity("someRange", "someName");
        ProductEntity product1 = new ProductEntity("someProduct", new BigDecimal(3.50),
                Collections.singletonList(range));
        ProductEntity product2 = new ProductEntity("someOtherProduct", new BigDecimal(5.80),
                Collections.singletonList(range));
        productRangeRepository.save(range);
        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);

        String body = "{" +
                "   'range': 'someOtherRange'," +
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
                .andExpect(status().isNotFound());

        assertTrue(orderRepository.findAll().isEmpty());
    }
}
