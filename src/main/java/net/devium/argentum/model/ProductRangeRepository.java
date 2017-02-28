package net.devium.argentum.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface ProductRangeRepository extends JpaRepository<ProductRange, String> {
}
