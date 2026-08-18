package com.stg.petclinic.repository;

import com.stg.petclinic.domain.Clinique;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Clinique entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CliniqueRepository extends JpaRepository<Clinique, Long> {}
