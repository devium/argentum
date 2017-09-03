package net.devium.argentum.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.math.BigDecimal;

@RepositoryRestResource(exported = false)
public interface BalanceEventRepository extends JpaRepository<BalanceEventEntity, Long> {
    @Query(value = "SELECT SUM(value) FROM BalanceEventEntity o")
    BigDecimal sumTotal();
}
