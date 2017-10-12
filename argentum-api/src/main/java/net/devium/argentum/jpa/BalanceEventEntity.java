package net.devium.argentum.jpa;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "balance_log")
public class BalanceEventEntity {
    @Id
    @GeneratedValue
    private long id;

    private Date time;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private GuestEntity guest;

    private BigDecimal value = BigDecimal.ZERO;

    private String description;

    public BalanceEventEntity() {
    }

    public BalanceEventEntity(GuestEntity guest, Date time, BigDecimal value, String description) {
        this.guest = guest;
        this.time = time;
        this.value = value;
        this.description = description;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public GuestEntity getGuest() {
        return guest;
    }

    public void setGuest(GuestEntity guest) {
        this.guest = guest;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BalanceEventEntity that = (BalanceEventEntity) o;

        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
