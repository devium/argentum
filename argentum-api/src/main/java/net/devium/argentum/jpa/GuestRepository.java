package net.devium.argentum.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.math.BigDecimal;
import java.util.List;

@RepositoryRestResource(exported = false)
public interface GuestRepository extends JpaRepository<GuestEntity, Long> {
    Page<GuestEntity> findByCodeContainsAndNameContainsAndMailContainsAndStatusContainsAllIgnoreCase(
            String code, String name, String mail, String status, Pageable pageRequest
    );

    GuestEntity findByCard(String card);

    List<GuestEntity> findFirst3ByCodeContainsIgnoreCase(String code);

    List<GuestEntity> findFirst3ByNameContainsIgnoreCase(String code);

    List<GuestEntity> findFirst3ByMailContainsIgnoreCase(String code);

    List<GuestEntity> findByCodeIn(Iterable<String> codes);

    List<GuestEntity> findByCardIn(Iterable<String> cards);

    long countByCheckedInNotNull();

    long countByCardNotNull();

    @Query(value = "SELECT SUM(balance) FROM GuestEntity g WHERE balance > 0")
    BigDecimal sumPositiveBalance();

    @Query(value = "SELECT SUM(balance) FROM GuestEntity g WHERE balance < 0")
    BigDecimal sumNegativeBalance();

    @Query(value = "SELECT SUM(bonus) FROM GuestEntity g")
    BigDecimal sumBonus();
}
