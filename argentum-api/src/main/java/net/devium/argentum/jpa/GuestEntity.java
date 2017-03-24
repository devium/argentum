package net.devium.argentum.jpa;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "guests")
public class GuestEntity {
    @Id
    @GeneratedValue
    private long id;
    private String code;
    private String name;
    private String mail;
    private String status;
    private Date checkedIn;
    private String card;
    private BigDecimal balance;
    private BigDecimal bonus;

    @OneToMany(mappedBy = "guest")
    private Set<OrderEntity> orders;

    public GuestEntity() {
    }

    public GuestEntity(String code, String name, String mail, String status, Date checkedIn, String card, BigDecimal balance, BigDecimal bonus) {
        this.code = code;
        this.name = name;
        this.mail = mail;
        this.status = status;
        this.checkedIn = checkedIn;
        this.card = card;
        this.balance = balance;
        this.bonus = bonus;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(Date checkedIn) {
        this.checkedIn = checkedIn;
    }

    public String getCard() {
        return card;
    }

    public void setCard(String card) {
        this.card = card;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getBonus() {
        return bonus;
    }

    public void setBonus(BigDecimal bonus) {
        this.bonus = bonus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        GuestEntity that = (GuestEntity) o;

        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
