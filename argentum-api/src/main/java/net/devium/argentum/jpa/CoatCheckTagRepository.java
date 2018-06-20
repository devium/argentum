package net.devium.argentum.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface CoatCheckTagRepository extends JpaRepository<CoatCheckTagEntity, Long> {
    List<CoatCheckTagEntity> findByGuest(GuestEntity guest);
}