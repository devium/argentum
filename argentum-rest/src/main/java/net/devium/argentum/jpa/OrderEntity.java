package net.devium.argentum.jpa;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "product_range_id")
    private ProductRangeEntity productRange;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "order_id")
    private List<OrderItemEntity> orderItems;

    public OrderEntity() {
    }

    public OrderEntity(ProductRangeEntity productRange, List<OrderItemEntity> orderItems) {
        this.productRange = productRange;
        this.orderItems = orderItems;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public ProductRangeEntity getProductRange() {
        return productRange;
    }

    public void setProductRange(ProductRangeEntity productRange) {
        this.productRange = productRange;
    }

    public List<OrderItemEntity> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemEntity> orderItems) {
        this.orderItems = orderItems;
    }
}
