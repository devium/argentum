package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.request.OrderItemRequest;
import net.devium.argentum.rest.model.request.OrderRequest;
import net.devium.argentum.rest.model.response.OrderResponse;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private ProductRangeRepository productRangeRepository;
    private OrderItemRepository orderItemRepository;

    @Autowired
    public OrderController(OrderRepository orderRepository,
                           ProductRepository productRepository,
                           ProductRangeRepository productRangeRepository,
                           OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productRangeRepository = productRangeRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getOrders() {
        List<OrderResponse> response = orderRepository.findAll().stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());

        return Response.ok(response);
    }

    @RequestMapping(path = "/{orderId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getOrder(@PathVariable long orderId) {
        OrderEntity order = orderRepository.findOne(orderId);

        if (order == null) {
            String message = String.format("Order with ID %s not found.", orderId);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        return Response.ok(OrderResponse.from(order));
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest order) {
        Set<Long> unknownProducts = order.getItems().stream()
                .map(OrderItemRequest::getProductId)
                .filter(productId -> !productRepository.exists(productId))
                .collect(Collectors.toSet());

        if (!unknownProducts.isEmpty()) {
            String message = String.format("Product(s) %s not found.", unknownProducts);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        // Oh no, it's retarded.
        final OrderEntity newOrder = orderRepository.save(new OrderEntity());

        Set<OrderItemEntity> orderItems = order.getItems().stream()
                .map(orderItem -> new OrderItemEntity(productRepository.findOne(orderItem.getProductId()),
                        orderItem.getQuantity(), newOrder))
                .collect(Collectors.toSet());
        orderItemRepository.save(orderItems);

        newOrder.setTotal(orderItems.stream()
                .map(orderItem -> orderItem.getProduct().getPrice().multiply(new BigDecimal(orderItem.getQuantity())))
                .reduce(new BigDecimal(0), BigDecimal::add));

        newOrder.setOrderItems(orderItems);
        orderRepository.save(newOrder);

        return Response.ok(OrderResponse.from(newOrder));
    }

}
