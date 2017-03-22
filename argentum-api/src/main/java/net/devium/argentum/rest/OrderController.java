package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.OrderItemRequest;
import net.devium.argentum.rest.model.OrderItemResponse;
import net.devium.argentum.rest.model.OrderRequest;
import net.devium.argentum.rest.model.OrderResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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

    private static OrderResponse toOrderResponse(OrderEntity order) {
        List<OrderItemResponse> orderItems = order.getOrderItems().stream()
                .map(orderItem -> new OrderItemResponse(orderItem.getProduct().getId(), orderItem.getQuantity()))
                .collect(Collectors.toList());
        return new OrderResponse(order.getId(), orderItems, order.getTotal());
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<List<OrderResponse>> getOrders() {
        List<OrderResponse> response = StreamSupport.stream(orderRepository.findAll().spliterator(), false)
                .map(OrderController::toOrderResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @RequestMapping(path = "/{orderId}", method = RequestMethod.GET)
    public ResponseEntity<OrderResponse> getOrder(@PathVariable long orderId) {
        OrderEntity order = orderRepository.findOne(orderId);

        if (order == null) {
            LOGGER.info("Order with ID {} not found.", orderId);
            throw new ResourceNotFoundException();
        }

        return ResponseEntity.ok(toOrderResponse(order));
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest order) {
        Set<Long> unknownProducts = order.getItems().stream()
                .map(OrderItemRequest::getProductId)
                .filter(productId -> !productRepository.exists(productId))
                .collect(Collectors.toSet());

        if (!unknownProducts.isEmpty()) {
            String message = String.format("Product(s) %s not found.", unknownProducts);
            throw new ResourceNotFoundException(message);
        }

        // Oh no, it's retarded.
        final OrderEntity newOrder = orderRepository.save(new OrderEntity());

        List<OrderItemEntity> orderItems = order.getItems().stream()
                .map(orderItem -> new OrderItemEntity(productRepository.findOne(orderItem.getProductId()),
                        orderItem.getQuantity(), newOrder))
                .collect(Collectors.toList());
        orderItems.forEach(orderItemRepository::save);

        newOrder.setTotal(orderItems.stream()
                .map(orderItem -> orderItem.getProduct().getPrice().multiply(new BigDecimal(orderItem.getQuantity())))
                .reduce(new BigDecimal(0), BigDecimal::add));

        newOrder.setOrderItems(orderItems);
        orderRepository.save(newOrder);

        return ResponseEntity.ok(toOrderResponse(newOrder));
    }

}
