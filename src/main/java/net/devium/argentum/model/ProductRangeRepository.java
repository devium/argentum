package net.devium.argentum.model;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRangeRepository extends PagingAndSortingRepository<ProductRange, String> {
}
