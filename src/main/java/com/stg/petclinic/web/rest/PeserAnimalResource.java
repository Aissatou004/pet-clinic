package com.stg.petclinic.web.rest;

import com.stg.petclinic.domain.PeserAnimal;
import com.stg.petclinic.repository.PeserAnimalRepository;
import com.stg.petclinic.service.PeserAnimalService;
import com.stg.petclinic.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.stg.petclinic.domain.PeserAnimal}.
 */
@RestController
@RequestMapping("/api/peser-animals")
public class PeserAnimalResource {

    private static final Logger LOG = LoggerFactory.getLogger(PeserAnimalResource.class);

    private static final String ENTITY_NAME = "peserAnimal";

    @Value("${jhipster.clientApp.name:petclinic}")
    private String applicationName;

    private final PeserAnimalService peserAnimalService;

    private final PeserAnimalRepository peserAnimalRepository;

    public PeserAnimalResource(PeserAnimalService peserAnimalService, PeserAnimalRepository peserAnimalRepository) {
        this.peserAnimalService = peserAnimalService;
        this.peserAnimalRepository = peserAnimalRepository;
    }

    /**
     * {@code POST  /peser-animals} : Create a new peserAnimal.
     *
     * @param peserAnimal the peserAnimal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new peserAnimal, or with status {@code 400 (Bad Request)} if the peserAnimal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PeserAnimal> createPeserAnimal(@Valid @RequestBody PeserAnimal peserAnimal) throws URISyntaxException {
        LOG.debug("REST request to save PeserAnimal : {}", peserAnimal);
        if (peserAnimal.getId() != null) {
            throw new BadRequestAlertException("A new peserAnimal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        peserAnimal = peserAnimalService.save(peserAnimal);
        return ResponseEntity.created(new URI("/api/peser-animals/" + peserAnimal.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, peserAnimal.getId().toString()))
            .body(peserAnimal);
    }

    /**
     * {@code PUT  /peser-animals/:id} : Updates an existing peserAnimal.
     *
     * @param id the id of the peserAnimal to save.
     * @param peserAnimal the peserAnimal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated peserAnimal,
     * or with status {@code 400 (Bad Request)} if the peserAnimal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the peserAnimal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PeserAnimal> updatePeserAnimal(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PeserAnimal peserAnimal
    ) throws URISyntaxException {
        LOG.debug("REST request to update PeserAnimal : {}, {}", id, peserAnimal);
        if (peserAnimal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, peserAnimal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!peserAnimalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        peserAnimal = peserAnimalService.update(peserAnimal);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, peserAnimal.getId().toString()))
            .body(peserAnimal);
    }

    /**
     * {@code PATCH  /peser-animals/:id} : Partial updates given fields of an existing peserAnimal, field will ignore if it is null
     *
     * @param id the id of the peserAnimal to save.
     * @param peserAnimal the peserAnimal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated peserAnimal,
     * or with status {@code 400 (Bad Request)} if the peserAnimal is not valid,
     * or with status {@code 404 (Not Found)} if the peserAnimal is not found,
     * or with status {@code 500 (Internal Server Error)} if the peserAnimal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PeserAnimal> partialUpdatePeserAnimal(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PeserAnimal peserAnimal
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PeserAnimal partially : {}, {}", id, peserAnimal);
        if (peserAnimal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, peserAnimal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!peserAnimalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PeserAnimal> result = peserAnimalService.partialUpdate(peserAnimal);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, peserAnimal.getId().toString())
        );
    }

    /**
     * {@code GET  /peser-animals} : get all the Peser Animals.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Peser Animals in body.
     */
    @GetMapping("")
    public ResponseEntity<List<PeserAnimal>> getAllPeserAnimals(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of PeserAnimals");
        Page<PeserAnimal> page = peserAnimalService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /peser-animals/:id} : get the "id" peserAnimal.
     *
     * @param id the id of the peserAnimal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the peserAnimal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PeserAnimal> getPeserAnimal(@PathVariable("id") Long id) {
        LOG.debug("REST request to get PeserAnimal : {}", id);
        Optional<PeserAnimal> peserAnimal = peserAnimalService.findOne(id);
        return ResponseUtil.wrapOrNotFound(peserAnimal);
    }

    /**
     * {@code DELETE  /peser-animals/:id} : delete the "id" peserAnimal.
     *
     * @param id the id of the peserAnimal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeserAnimal(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete PeserAnimal : {}", id);
        peserAnimalService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
