package com.stg.petclinic.repository;

import com.stg.petclinic.domain.PeserAnimal;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PeserAnimal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PeserAnimalRepository extends JpaRepository<PeserAnimal, Long> {}
