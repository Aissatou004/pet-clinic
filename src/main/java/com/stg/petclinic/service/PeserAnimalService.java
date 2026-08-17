package com.stg.petclinic.service;

import com.stg.petclinic.domain.PeserAnimal;
import com.stg.petclinic.repository.PeserAnimalRepository;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.stg.petclinic.domain.PeserAnimal}.
 */
@Service
@Transactional
public class PeserAnimalService {

    private static final Logger LOG = LoggerFactory.getLogger(PeserAnimalService.class);

    private final PeserAnimalRepository peserAnimalRepository;

    public PeserAnimalService(PeserAnimalRepository peserAnimalRepository) {
        this.peserAnimalRepository = peserAnimalRepository;
    }

    /**
     * Save a peserAnimal.
     *
     * @param peserAnimal the entity to save.
     * @return the persisted entity.
     */
    public PeserAnimal save(PeserAnimal peserAnimal) {
        LOG.debug("Request to save PeserAnimal : {}", peserAnimal);
        return peserAnimalRepository.save(peserAnimal);
    }

    /**
     * Update a peserAnimal.
     *
     * @param peserAnimal the entity to save.
     * @return the persisted entity.
     */
    public PeserAnimal update(PeserAnimal peserAnimal) {
        LOG.debug("Request to update PeserAnimal : {}", peserAnimal);
        return peserAnimalRepository.save(peserAnimal);
    }

    /**
     * Partially update a peserAnimal.
     *
     * @param peserAnimal the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PeserAnimal> partialUpdate(PeserAnimal peserAnimal) {
        LOG.debug("Request to partially update PeserAnimal : {}", peserAnimal);

        return peserAnimalRepository
            .findById(peserAnimal.getId())
            .map(existingPeserAnimal -> {
                updateIfPresent(existingPeserAnimal::setPoids, peserAnimal.getPoids());

                return existingPeserAnimal;
            })
            .map(peserAnimalRepository::save);
    }

    /**
     * Get all the peserAnimals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PeserAnimal> findAll(Pageable pageable) {
        LOG.debug("Request to get all PeserAnimals");
        return peserAnimalRepository.findAll(pageable);
    }

    /**
     * Get one peserAnimal by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PeserAnimal> findOne(Long id) {
        LOG.debug("Request to get PeserAnimal : {}", id);
        return peserAnimalRepository.findById(id);
    }

    /**
     * Delete the peserAnimal by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete PeserAnimal : {}", id);
        peserAnimalRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
