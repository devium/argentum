package net.devium.argentum.rest.model.response;

import java.math.BigDecimal;

public class StatisticsResponse {
    private final long guestsTotal;
    private final long guestsCheckedIn;
    private final long cardsTotal;
    private final BigDecimal totalBalance;
    private final BigDecimal totalBonus;
    private final BigDecimal totalSpent;
    private final long numProducts;
    private final long numLegacyProducts;
    private final long numRanges;
    private final long numCategories;

    public StatisticsResponse(
            long guestsTotal,
            long guestsCheckedIn,
            long cardsTotal,
            BigDecimal totalBalance,
            BigDecimal totalBonus,
            BigDecimal totalSpent,
            long numProducts,
            long numLegacyProducts,
            long numRanges,
            long numCategories) {
        this.guestsTotal = guestsTotal;
        this.guestsCheckedIn = guestsCheckedIn;
        this.cardsTotal = cardsTotal;
        this.totalBalance = totalBalance;
        this.totalBonus = totalBonus;
        this.totalSpent = totalSpent;
        this.numProducts = numProducts;
        this.numLegacyProducts = numLegacyProducts;
        this.numRanges = numRanges;
        this.numCategories = numCategories;
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

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public BigDecimal getTotalBonus() {
        return totalBonus;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
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
}
