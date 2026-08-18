package com.stg.petclinic.service;

import com.stg.petclinic.domain.Animal;
import com.stg.petclinic.repository.AnimalRepository;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.stg.petclinic.domain.Animal}.
 */
@Service
@Transactional
public class AnimalService {

    private static final Logger LOG = LoggerFactory.getLogger(AnimalService.class);

    private final AnimalRepository animalRepository;

    public AnimalService(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    /**
     * Save a animal.
     *
     * @param animal the entity to save.
     * @return the persisted entity.
     */
    public Animal save(Animal animal) {
        LOG.debug("Request to save Animal : {}", animal);
        return animalRepository.save(animal);
    }

    /**
     * Update a animal.
     *
     * @param animal the entity to save.
     * @return the persisted entity.
     */
    public Animal update(Animal animal) {
        LOG.debug("Request to update Animal : {}", animal);
        return animalRepository.save(animal);
    }

    /**
     * Partially update a animal.
     *
     * @param animal the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Animal> partialUpdate(Animal animal) {
        LOG.debug("Request to partially update Animal : {}", animal);

        return animalRepository
            .findById(animal.getId())
            .map(existingAnimal -> {
                updateIfPresent(existingAnimal::setNom, animal.getNom());
                updateIfPresent(existingAnimal::setEspece, animal.getEspece());
                updateIfPresent(existingAnimal::setDateNaissance, animal.getDateNaissance());
                updateIfPresent(existingAnimal::setSexe, animal.getSexe());

                return existingAnimal;
            })
            .map(animalRepository::save);
    }

    /**
     * Get all the animals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Animal> findAll(Pageable pageable) {
        LOG.debug("Request to get all Animals");
        return animalRepository.findAll(pageable);
    }

    /**
     * Get one animal by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Animal> findOne(Long id) {
        LOG.debug("Request to get Animal : {}", id);
        return animalRepository.findById(id);
    }

    /**
     * Delete the animal by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Animal : {}", id);
        animalRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
