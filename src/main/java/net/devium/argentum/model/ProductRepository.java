package net.devium.argentum.model;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface ProductRepository extends PagingAndSortingRepository<Product, Long> {
}
