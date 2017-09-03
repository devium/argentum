package net.devium.argentum.rest.model.response;

import java.math.BigDecimal;

public class ConfigResponse {
    private final BigDecimal postpaidLimit;

    public ConfigResponse(BigDecimal postpaidLimit) {
        this.postpaidLimit = postpaidLimit;
    }

    public BigDecimal getPostpaidLimit() {
        return postpaidLimit;
    }
}
