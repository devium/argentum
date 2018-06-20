package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.*;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.Date;
import java.util.function.Supplier;

import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;

abstract class AbstractBalanceController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    GuestRepository guestRepository;
    BalanceEventRepository balanceEventRepository;
    ConfigRepository configRepository;

    AbstractBalanceController(
            GuestRepository guestRepository,
            BalanceEventRepository balanceEventRepository,
            ConfigRepository configRepository
    ) {
        this.guestRepository = guestRepository;
        this.balanceEventRepository = balanceEventRepository;
        this.configRepository = configRepository;
    }

    ResponseEntity<?> credit(GuestEntity guest, BigDecimal total) {
        total = total.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP);

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

        return null;
    }
}
