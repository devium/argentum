package net.devium.argentum.jpa;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue
    private long id;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderItemEntity> orderItems;

    private BigDecimal total = new BigDecimal(0);

    public OrderEntity() {
    }

    public OrderEntity(BigDecimal total) {
        this.total = total;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public List<OrderItemEntity> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemEntity> orderItems) {
        this.orderItems = orderItems;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
