package com.stg.petclinic.service;

import com.stg.petclinic.domain.RendezVous;
import com.stg.petclinic.repository.RendezVousRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.stg.petclinic.domain.RendezVous}.
 */
@Service
@Transactional
public class RendezVousService {

    private static final Logger LOG = LoggerFactory.getLogger(RendezVousService.class);

    private final RendezVousRepository rendezVousRepository;

    public RendezVousService(RendezVousRepository rendezVousRepository) {
        this.rendezVousRepository = rendezVousRepository;
    }

    /**
     * Save a rendezVous.
     *
     * @param rendezVous the entity to save.
     * @return the persisted entity.
     */
    public RendezVous save(RendezVous rendezVous) {
        LOG.debug("Request to save RendezVous : {}", rendezVous);
        verifierDateNonPassee(rendezVous.getDate());
        return rendezVousRepository.save(rendezVous);
    }

    /**
     * Update a rendezVous.
     *
     * @param rendezVous the entity to save.
     * @return the persisted entity.
     */
    public RendezVous update(RendezVous rendezVous) {
        LOG.debug("Request to update RendezVous : {}", rendezVous);
        verifierDateNonPassee(rendezVous.getDate());
        return rendezVousRepository.save(rendezVous);
    }

    /**
     * Partially update a rendezVous.
     *
     * @param rendezVous the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<RendezVous> partialUpdate(RendezVous rendezVous) {
        LOG.debug("Request to partially update a rendezVous : {}", rendezVous);

        if (rendezVous.getDate() != null) {
            verifierDateNonPassee(rendezVous.getDate());
        }

        return rendezVousRepository
            .findById(rendezVous.getId())
            .map(existingRendezVous -> {
                updateIfPresent(existingRendezVous::setDate, rendezVous.getDate());
                updateIfPresent(existingRendezVous::setMotif, rendezVous.getMotif());
                updateIfPresent(existingRendezVous::setDuree, rendezVous.getDuree());

                verifierDateNonPassee(existingRendezVous.getDate());

                return existingRendezVous;
            })
            .map(rendezVousRepository::save);
    }

    /**
     * Get all the rendezVouses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<RendezVous> findAll(Pageable pageable) {
        LOG.debug("Request to get all RendezVouses");
        return rendezVousRepository.findAll(pageable);
    }

    /**
     * Get all the rendezVouses where PeserAnimal is {@code null}.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<RendezVous> findAllWherePeserAnimalIsNull() {
        LOG.debug("Request to get all rendezVouses where PeserAnimal is null");
        return rendezVousRepository
            .findAll()
            .stream()
            .filter(rendezVous -> rendezVous.getPeserAnimal() == null)
            .toList();
    }

    /**
     * Get one rendezVous by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<RendezVous> findOne(Long id) {
        LOG.debug("Request to get RendezVous : {}", id);
        return rendezVousRepository.findById(id);
    }

    /**
     * Delete the rendezVous by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete RendezVous : {}", id);
        rendezVousRepository.deleteById(id);
    }

    /**
     * Vérifie que la date du rendez-vous n'est pas dans le passé.
     *
     * @param dateRdv la date du rendez-vous à vérifier.
     */
    private void verifierDateNonPassee(Instant dateRdv) {
        if (dateRdv != null && dateRdv.isBefore(Instant.now())) {
            throw new RendezVousDatePasseeException();
        }
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
