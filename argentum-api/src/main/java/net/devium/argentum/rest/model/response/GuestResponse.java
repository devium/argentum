package net.devium.argentum.rest.model.response;

import net.devium.argentum.jpa.GuestEntity;

import java.math.BigDecimal;
import java.util.Date;

public class GuestResponse {
    private final long id;
    private final String code;
    private final String name;
    private final String mail;
    private final String status;
    private final Date checkedIn;
    private final String card;
    private final BigDecimal balance;
    private final BigDecimal bonus;

    private GuestResponse(long id, String code, String name, String mail, String status, Date checkedIn, String card,
                          BigDecimal balance, BigDecimal bonus) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.mail = mail;
        this.status = status;
        this.checkedIn = checkedIn;
        this.card = card;
        this.balance = balance;
        this.bonus = bonus;
    }

    public static GuestResponse from(GuestEntity guest) {
        return new GuestResponse(
                guest.getId(),
                guest.getCode(),
                guest.getName(),
                guest.getMail(),
                guest.getStatus(),
                guest.getCheckedIn(),
                guest.getCard(),
                guest.getBalance(),
                guest.getBonus()
        );
    }

    public long getId() {
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
}
