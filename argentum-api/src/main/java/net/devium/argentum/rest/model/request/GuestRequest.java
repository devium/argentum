package net.devium.argentum.rest.model.request;

import net.devium.argentum.jpa.GuestEntity;

import java.math.BigDecimal;
import java.util.Date;

import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;

public class GuestRequest {
    private Long id;
    private String code;
    private String name;
    private String mail;
    private String status;
    private Date checkedIn;
    private String card;
    private BigDecimal balance;
    private BigDecimal bonus;

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getMail() {
        return mail;
    }

    public String getStatus() {
        return status;
    }

    public Date getCheckedIn() {
        return checkedIn;
    }

    public String getCard() {
        return card;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public BigDecimal getBonus() {
        return bonus;
    }

    public GuestEntity toEntity() {
        return new GuestEntity(
                id != null ? id : -1,
                code != null ? code : "",
                name != null ? name : "",
                mail != null ? mail : "",
                status != null ? status : "",
                checkedIn,
                card,
                balance != null ? balance : BigDecimal.ZERO.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP),
                bonus != null ? bonus : BigDecimal.ZERO.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)
        );
    }
}
