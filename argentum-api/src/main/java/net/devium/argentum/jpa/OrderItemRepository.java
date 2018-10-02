package net.devium.argentum.jpa;

import net.devium.argentum.rest.model.response.QuantitySalesResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;


@RepositoryRestResource(exported = false)
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
    @Query(
            value = "SELECT new net.devium.argentum.rest.model.response.QuantitySalesResponse(" +
                    "   product.id, SUM(quantity - cancelled)" +
                    ") FROM OrderItemEntity oi WHERE oi.quantity > oi.cancelled GROUP BY product.id"
    )
    List<QuantitySalesResponse> sumQuantitySales();
}
