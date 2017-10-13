package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.request.CancelOrderItemRequest;
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

import static java.lang.Integer.min;
import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private ProductRangeRepository productRangeRepository;
    private OrderItemRepository orderItemRepository;
    private BalanceEventRepository balanceEventRepository;
    private GuestRepository guestRepository;
    private ConfigRepository configRepository;

    @Autowired
    public OrderController(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            ProductRangeRepository productRangeRepository,
            OrderItemRepository orderItemRepository,
            BalanceEventRepository balanceEventRepository,
            GuestRepository guestRepository,
            ConfigRepository configRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productRangeRepository = productRangeRepository;
        this.orderItemRepository = orderItemRepository;
        this.balanceEventRepository = balanceEventRepository;
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

    @RequestMapping(
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest order) {
        Set<Long> unknownProducts = new HashSet<>();
        List<OrderItemEntity> orderItems = new LinkedList<>();
        BigDecimal total = BigDecimal.ZERO;

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

        // Get postpaid limit if set.
        BigDecimal postpaidLimit = BigDecimal.ZERO;
        ConfigEntity postpaidLimitEntry = configRepository.findOne("postpaidLimit");
        if (postpaidLimitEntry != null) {
            postpaidLimit = new BigDecimal(postpaidLimitEntry.getValue());
        }

        // Check balance.
        BigDecimal totalPostBonus = total.subtract(guest.getBonus());
        if (totalPostBonus.compareTo(BigDecimal.ZERO) <= 0) {
            guest.setBonus(guest.getBonus().subtract(total));
        } else if (guest.getBalance().subtract(totalPostBonus).compareTo(postpaidLimit.negate()) >= 0) {
            guest.setBonus(BigDecimal.ZERO);
            guest.setBalance(guest.getBalance().subtract(totalPostBonus));
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

    @RequestMapping(
            method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    @Transactional
    public ResponseEntity<?> cancelOrderItem(@RequestBody List<CancelOrderItemRequest> orderItems) {
        // Sort into full order item cancels and custom total cancels.
        Set<CancelOrderItemRequest> orderCustomCancelled = new HashSet<>();
        Set<CancelOrderItemRequest> orderItemsCancelled = new HashSet<>();

        for (CancelOrderItemRequest orderItem: orderItems) {
            if (orderItem.getCustomTotal() == null) {
                orderItemsCancelled.add(orderItem);
            } else  {
                orderCustomCancelled.add(orderItem);
            }
        }

        if (orderCustomCancelled.size() + orderItemsCancelled.size() != orderItems.size()) {
            String message = "Duplicate orders or order items found.";
            LOGGER.info(message);
            return Response.badRequest(message);
        }

        List<OrderEntity> updatedOrders = new LinkedList<>();
        List<GuestEntity> updatedGuests = new LinkedList<>();
        List<BalanceEventEntity> balanceEvents = new LinkedList<>();
        for (CancelOrderItemRequest orderItemRequest: orderCustomCancelled) {
            OrderEntity order = orderRepository.findOne(orderItemRequest.getId());
            if (order == null) {
                String message = String.format("Order %s not found.", orderItemRequest.getId());
                LOGGER.info(message);
                return Response.notFound(message);
            }

            // Check if the cancelled amount is already included in the order's cancelled amount.
            if (orderItemRequest.getCustomTotal().compareTo(order.getCustomCancelled()) <= 0) {
                continue;
            }

            // Calculate how much of the order's total is actually from custom products (=total - sum(products)).
            BigDecimal orderItemTotal = BigDecimal.ZERO;
            for (OrderItemEntity orderItem : order.getOrderItems()) {
                orderItemTotal = orderItemTotal.add(
                        orderItem.getProduct().getPrice().multiply(new BigDecimal(orderItem.getQuantity()))
                );
            }
            // Update custom cancelled amount.
            BigDecimal customTotal = order.getTotal().subtract(orderItemTotal);
            BigDecimal newCustomCancelled = customTotal.min(orderItemRequest.getCustomTotal());
            BigDecimal refund = newCustomCancelled.subtract(order.getCustomCancelled());
            order.setCustomCancelled(newCustomCancelled);

            // Refund guest.
            GuestEntity guest = order.getGuest();
            guest.setBalance(guest.getBalance().add(refund));

            BalanceEventEntity balanceEvent = new BalanceEventEntity(guest, new Date(), refund, "refund");

            updatedOrders.add(order);
            updatedGuests.add(guest);
            balanceEvents.add(balanceEvent);
        }

        orderRepository.save(updatedOrders);
        guestRepository.save(updatedGuests);
        balanceEventRepository.save(balanceEvents);

        updatedGuests.clear();
        balanceEvents.clear();

        List<OrderItemEntity> updatedOrderItems = new LinkedList<>();
        for (CancelOrderItemRequest orderItemRequest: orderItemsCancelled) {
            OrderItemEntity orderItem = orderItemRepository.findOne(orderItemRequest.getId());
            if (orderItem == null) {
                String message = String.format("Order item %s not found.", orderItemRequest.getId());
                LOGGER.info(message);
                return Response.notFound(message);
            }

            if (orderItemRequest.getCancelled() <= orderItem.getCancelled()) {
                continue;
            }

            // Update order item cancelled quantity.
            int newCancelled = min(orderItem.getQuantity(), orderItemRequest.getCancelled());
            BigDecimal refund = orderItem.getProduct().getPrice().multiply(
                    new BigDecimal(newCancelled - orderItem.getCancelled())
            );
            orderItem.setCancelled(newCancelled);

            // Refund guest.
            GuestEntity guest = orderItem.getOrder().getGuest();
            guest.setBalance(guest.getBalance().add(refund));

            BalanceEventEntity balanceEvent = new BalanceEventEntity(guest, new Date(), refund, "refund");

            updatedOrderItems.add(orderItem);
            updatedGuests.add(guest);
            balanceEvents.add(balanceEvent);
        }

        orderItemRepository.save(updatedOrderItems);
        guestRepository.save(updatedGuests);
        balanceEventRepository.save(balanceEvents);

        return ResponseEntity.noContent().build();
    }
}
