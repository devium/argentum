package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private ProductRangeRepository productRangeRepository;
    private OrderItemRepository orderItemRepository;
    private GuestRepository guestRepository;
    private ConfigRepository configRepository;

    @Autowired
    public OrderController(OrderRepository orderRepository,
                           ProductRepository productRepository,
                           ProductRangeRepository productRangeRepository,
                           OrderItemRepository orderItemRepository,
                           GuestRepository guestRepository,
                           ConfigRepository configRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productRangeRepository = productRangeRepository;
        this.orderItemRepository = orderItemRepository;
        this.guestRepository = guestRepository;
        this.configRepository = configRepository;
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
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest order) {
        Set<Long> unknownProducts = new HashSet<>();
        List<OrderItemEntity> orderItems = new LinkedList<>();
        BigDecimal total = new BigDecimal(0.00);

        // Enumerate products and check for existence.
        for (OrderItemRequest orderItem : order.getItems()) {
            ProductEntity product = productRepository.findOne(orderItem.getProductId());
            if (product == null) {
                unknownProducts.add(orderItem.getProductId());
            } else {
                total = total.add(product.getPrice().multiply(new BigDecimal(orderItem.getQuantity())));
                orderItems.add(new OrderItemEntity(product, orderItem.getQuantity()));
            }
        }
        if (order.getCustomTotal() != null) {
            total = total.add(order.getCustomTotal());
        }
        total = total.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP);

        if (!unknownProducts.isEmpty()) {
            String message = String.format("Product(s) %s not found.", unknownProducts);
            LOGGER.info(message);
            return Response.notFound(message);
        }

        // Lookup / check guest.
        GuestEntity guest = order.getGuestId() != null ? guestRepository.findOne(order.getGuestId()) : null;
        if (guest == null) {
            String message = String.format("Guest %s not found.", order.getGuestId());
            LOGGER.info(message);
            return Response.notFound(message);
        }

        ConfigEntity prepaidEntry = configRepository.findOne("prepaid");
        boolean prepaid = prepaidEntry == null || prepaidEntry.getValue().equals("true");

        // Check balance.
        if (guest.getBonus().compareTo(total) >= 0) {
            guest.setBonus(guest.getBonus().subtract(total));
        } else if (!prepaid || guest.getBalance().compareTo(total.subtract(guest.getBonus())) >= 0) {
            guest.setBalance(guest.getBalance().subtract(total.subtract(guest.getBonus())));
            guest.setBonus(new BigDecimal(0).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP));
        } else {
            String message = "Insufficient funds.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }
        guestRepository.save(guest);

        OrderEntity newOrder = orderRepository.save(new OrderEntity(guest, new Date(), total));
        orderItems.forEach(orderItem -> orderItem.setOrder(newOrder));
        orderItems = orderItemRepository.save(orderItems);
        newOrder.setOrderItems(ImmutableSet.copyOf(orderItems));

        return Response.ok(OrderResponse.from(newOrder));
    }

}
