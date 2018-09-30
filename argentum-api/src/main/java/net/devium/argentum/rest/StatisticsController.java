package net.devium.argentum.rest;

import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.response.Response;
import net.devium.argentum.rest.model.response.StatisticsResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private ProductRangeRepository productRangeRepository;
    private CategoryRepository categoryRepository;
    private GuestRepository guestRepository;
    private BalanceEventRepository balanceEventRepository;

    @Autowired
    public StatisticsController(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            ProductRangeRepository productRangeRepository,
            CategoryRepository categoryRepository,
            GuestRepository guestRepository,
            BalanceEventRepository balanceEventRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productRangeRepository = productRangeRepository;
        this.categoryRepository = categoryRepository;
        this.guestRepository = guestRepository;
        this.balanceEventRepository = balanceEventRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getStatistics() {
        long guestsTotal = guestRepository.count();
        long guestsCheckedIn = guestRepository.countByCheckedInNotNull();
        long cardsTotal = guestRepository.countByCardNotNull();
        BigDecimal totalPositiveBalance = guestRepository.sumPositiveBalance();
        totalPositiveBalance = totalPositiveBalance != null ? totalPositiveBalance : BigDecimal.ZERO;
        BigDecimal totalNegativeBalance = guestRepository.sumNegativeBalance();
        totalNegativeBalance = totalNegativeBalance != null ? totalNegativeBalance.negate() : BigDecimal.ZERO;
        BigDecimal totalBonus = guestRepository.sumBonus();
        totalBonus = totalBonus != null ? totalBonus : BigDecimal.ZERO;
        BigDecimal totalSpent = orderRepository.sumTotal();
        totalSpent = totalSpent != null ? totalSpent : BigDecimal.ZERO;
        BigDecimal totalRefund = balanceEventRepository.sumRefunds();
        totalRefund = totalRefund != null ? totalRefund : BigDecimal.ZERO;
        BigDecimal totalDeposited = balanceEventRepository.sumDeposits();
        totalDeposited = totalDeposited != null ? totalDeposited : BigDecimal.ZERO;
        BigDecimal totalWithdrawn = balanceEventRepository.sumWithdrawals();
        totalWithdrawn = totalWithdrawn != null ? totalWithdrawn.negate() : BigDecimal.ZERO;

        long numProducts = productRepository.count();
        long numLegacyProducts = productRepository.countByLegacyIsTrue();
        long numRanges = productRangeRepository.count();
        long numCategories = categoryRepository.count();

        return Response.ok(new StatisticsResponse(
                guestsTotal,
                guestsCheckedIn,
                cardsTotal,
                totalPositiveBalance,
                totalNegativeBalance,
                totalBonus,
                totalSpent,
                totalRefund,
                totalDeposited,
                totalWithdrawn,
                numProducts,
                numLegacyProducts,
                numRanges,
                numCategories
        ));
    }
}
