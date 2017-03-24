package net.devium.argentum.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface GuestRepository extends JpaRepository<GuestEntity, Long> {
    Page<GuestEntity> findByCodeContainsAndNameContainsAndMailContainsAndStatusContainsAllIgnoreCase(
            String code, String name, String mail, String status, Pageable pageRequest
    );
}
