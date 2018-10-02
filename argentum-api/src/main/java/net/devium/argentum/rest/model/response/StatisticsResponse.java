package net.devium.argentum.rest.model.response;

import java.math.BigDecimal;
import java.util.List;

public class StatisticsResponse {
    ;

    private final long guestsTotal;
    private final long guestsCheckedIn;
    private final long cardsTotal;
    private final BigDecimal totalPositiveBalance;
    private final BigDecimal totalNegativeBalance;
    private final BigDecimal totalBonus;
    private final BigDecimal totalSpent;
    private final BigDecimal totalRefund;
    private final BigDecimal totalDeposited;
    private final BigDecimal totalWithdrawn;
    private final long numProducts;
    private final long numLegacyProducts;
    private final long numRanges;
    private final long numCategories;
    private final List<QuantitySalesResponse> quantitySales;

    public StatisticsResponse(
            long guestsTotal,
            long guestsCheckedIn,
            long cardsTotal,
            BigDecimal totalPositiveBalance,
            BigDecimal totalNegativeBalance,
            BigDecimal totalBonus,
            BigDecimal totalSpent,
            BigDecimal totalRefund,
            BigDecimal totalDeposited,
            BigDecimal totalWithdrawn,
            long numProducts,
            long numLegacyProducts,
            long numRanges,
            long numCategories,
            List<QuantitySalesResponse> quantitySales
    ) {
        this.guestsTotal = guestsTotal;
        this.guestsCheckedIn = guestsCheckedIn;
        this.cardsTotal = cardsTotal;
        this.totalPositiveBalance = totalPositiveBalance;
        this.totalNegativeBalance = totalNegativeBalance;
        this.totalBonus = totalBonus;
        this.totalSpent = totalSpent;
        this.totalRefund = totalRefund;
        this.totalDeposited = totalDeposited;
        this.totalWithdrawn = totalWithdrawn;
        this.numProducts = numProducts;
        this.numLegacyProducts = numLegacyProducts;
        this.numRanges = numRanges;
        this.numCategories = numCategories;
        this.quantitySales = quantitySales;
    }

    public long getGuestsTotal() {
        return guestsTotal;
    }

    public long getGuestsCheckedIn() {
        return guestsCheckedIn;
    }

    public long getCardsTotal() {
        return cardsTotal;
    }

    public BigDecimal getTotalPositiveBalance() {
        return totalPositiveBalance;
    }

    public BigDecimal getTotalNegativeBalance() {
        return totalNegativeBalance;
    }

    public BigDecimal getTotalBonus() {
        return totalBonus;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public BigDecimal getTotalRefund() {
        return totalRefund;
    }

    public BigDecimal getTotalDeposited() {
        return totalDeposited;
    }

    public BigDecimal getTotalWithdrawn() {
        return totalWithdrawn;
    }

    public long getNumProducts() {
        return numProducts;
    }

    public long getNumLegacyProducts() {
        return numLegacyProducts;
    }

    public long getNumRanges() {
        return numRanges;
    }

    public long getNumCategories() {
        return numCategories;
    }

    public List<QuantitySalesResponse> getQuantitySales() {
        return quantitySales;
    }
}
