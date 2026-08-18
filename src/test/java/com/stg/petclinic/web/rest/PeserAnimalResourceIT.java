package com.stg.petclinic.web.rest;

import static com.stg.petclinic.domain.PeserAnimalAsserts.*;
import static com.stg.petclinic.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stg.petclinic.IntegrationTest;
import com.stg.petclinic.domain.Animal;
import com.stg.petclinic.domain.PeserAnimal;
import com.stg.petclinic.domain.RendezVous;
import com.stg.petclinic.repository.PeserAnimalRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PeserAnimalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PeserAnimalResourceIT {

    private static final Double DEFAULT_POIDS = 1D;
    private static final Double UPDATED_POIDS = 2D;

    private static final String ENTITY_API_URL = "/api/peser-animals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PeserAnimalRepository peserAnimalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPeserAnimalMockMvc;

    private PeserAnimal peserAnimal;

    private PeserAnimal insertedPeserAnimal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PeserAnimal createEntity(EntityManager em) {
        PeserAnimal peserAnimal = new PeserAnimal().poids(DEFAULT_POIDS);
        // Add required entity
        RendezVous rendezVous;
        if (TestUtil.findAll(em, RendezVous.class).isEmpty()) {
            rendezVous = RendezVousResourceIT.createEntity(em);
            em.persist(rendezVous);
            em.flush();
        } else {
            rendezVous = TestUtil.findAll(em, RendezVous.class).get(0);
        }
        peserAnimal.setRendezVous(rendezVous);
        // Add required entity
        Animal animal;
        if (TestUtil.findAll(em, Animal.class).isEmpty()) {
            animal = AnimalResourceIT.createEntity(em);
            em.persist(animal);
            em.flush();
        } else {
            animal = TestUtil.findAll(em, Animal.class).get(0);
        }
        peserAnimal.setAnimal(animal);
        return peserAnimal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PeserAnimal createUpdatedEntity(EntityManager em) {
        PeserAnimal updatedPeserAnimal = new PeserAnimal().poids(UPDATED_POIDS);
        // Add required entity
        RendezVous rendezVous;
        if (TestUtil.findAll(em, RendezVous.class).isEmpty()) {
            rendezVous = RendezVousResourceIT.createUpdatedEntity(em);
            em.persist(rendezVous);
            em.flush();
        } else {
            rendezVous = TestUtil.findAll(em, RendezVous.class).get(0);
        }
        updatedPeserAnimal.setRendezVous(rendezVous);
        // Add required entity
        Animal animal;
        if (TestUtil.findAll(em, Animal.class).isEmpty()) {
            animal = AnimalResourceIT.createUpdatedEntity(em);
            em.persist(animal);
            em.flush();
        } else {
            animal = TestUtil.findAll(em, Animal.class).get(0);
        }
        updatedPeserAnimal.setAnimal(animal);
        return updatedPeserAnimal;
    }

    @BeforeEach
    void initTest() {
        peserAnimal = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedPeserAnimal != null) {
            peserAnimalRepository.delete(insertedPeserAnimal);
            insertedPeserAnimal = null;
        }
    }

    @Test
    @Transactional
    void createPeserAnimal() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PeserAnimal
        var returnedPeserAnimal = om.readValue(
            restPeserAnimalMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(peserAnimal)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PeserAnimal.class
        );

        // Validate the PeserAnimal in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPeserAnimalUpdatableFieldsEquals(returnedPeserAnimal, getPersistedPeserAnimal(returnedPeserAnimal));

        insertedPeserAnimal = returnedPeserAnimal;
    }

    @Test
    @Transactional
    void createPeserAnimalWithExistingId() throws Exception {
        // Create the PeserAnimal with an existing ID
        peserAnimal.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPeserAnimalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(peserAnimal)))
            .andExpect(status().isBadRequest());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPoidsIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        peserAnimal.setPoids(null);

        // Create the PeserAnimal, which fails.

        restPeserAnimalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(peserAnimal)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPeserAnimals() throws Exception {
        // Initialize the database
        insertedPeserAnimal = peserAnimalRepository.saveAndFlush(peserAnimal);

        // Get all the peserAnimalList
        restPeserAnimalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(peserAnimal.getId().intValue())))
            .andExpect(jsonPath("$.[*].poids").value(hasItem(DEFAULT_POIDS)));
    }

    @Test
    @Transactional
    void getPeserAnimal() throws Exception {
        // Initialize the database
        insertedPeserAnimal = peserAnimalRepository.saveAndFlush(peserAnimal);

        // Get the peserAnimal
        restPeserAnimalMockMvc
            .perform(get(ENTITY_API_URL_ID, peserAnimal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(peserAnimal.getId().intValue()))
            .andExpect(jsonPath("$.poids").value(DEFAULT_POIDS));
    }

    @Test
    @Transactional
    void getNonExistingPeserAnimal() throws Exception {
        // Get the peserAnimal
        restPeserAnimalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPeserAnimal() throws Exception {
        // Initialize the database
        insertedPeserAnimal = peserAnimalRepository.saveAndFlush(peserAnimal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the peserAnimal
        PeserAnimal updatedPeserAnimal = peserAnimalRepository.findById(peserAnimal.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPeserAnimal are not directly saved in db
        em.detach(updatedPeserAnimal);
        updatedPeserAnimal.poids(UPDATED_POIDS);

        restPeserAnimalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPeserAnimal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPeserAnimal))
            )
            .andExpect(status().isOk());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPeserAnimalToMatchAllProperties(updatedPeserAnimal);
    }

    @Test
    @Transactional
    void putNonExistingPeserAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        peserAnimal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPeserAnimalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, peserAnimal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(peserAnimal))
            )
            .andExpect(status().isBadRequest());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPeserAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        peserAnimal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPeserAnimalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(peserAnimal))
            )
            .andExpect(status().isBadRequest());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPeserAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        peserAnimal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPeserAnimalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(peserAnimal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePeserAnimalWithPatch() throws Exception {
        // Initialize the database
        insertedPeserAnimal = peserAnimalRepository.saveAndFlush(peserAnimal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the peserAnimal using partial update
        PeserAnimal partialUpdatedPeserAnimal = new PeserAnimal();
        partialUpdatedPeserAnimal.setId(peserAnimal.getId());

        restPeserAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPeserAnimal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPeserAnimal))
            )
            .andExpect(status().isOk());

        // Validate the PeserAnimal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPeserAnimalUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPeserAnimal, peserAnimal),
            getPersistedPeserAnimal(peserAnimal)
        );
    }

    @Test
    @Transactional
    void fullUpdatePeserAnimalWithPatch() throws Exception {
        // Initialize the database
        insertedPeserAnimal = peserAnimalRepository.saveAndFlush(peserAnimal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the peserAnimal using partial update
        PeserAnimal partialUpdatedPeserAnimal = new PeserAnimal();
        partialUpdatedPeserAnimal.setId(peserAnimal.getId());

        partialUpdatedPeserAnimal.poids(UPDATED_POIDS);

        restPeserAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPeserAnimal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPeserAnimal))
            )
            .andExpect(status().isOk());

        // Validate the PeserAnimal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPeserAnimalUpdatableFieldsEquals(partialUpdatedPeserAnimal, getPersistedPeserAnimal(partialUpdatedPeserAnimal));
    }

    @Test
    @Transactional
    void patchNonExistingPeserAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        peserAnimal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPeserAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, peserAnimal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(peserAnimal))
            )
            .andExpect(status().isBadRequest());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPeserAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        peserAnimal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPeserAnimalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(peserAnimal))
            )
            .andExpect(status().isBadRequest());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPeserAnimal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        peserAnimal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPeserAnimalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(peserAnimal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PeserAnimal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePeserAnimal() throws Exception {
        // Initialize the database
        insertedPeserAnimal = peserAnimalRepository.saveAndFlush(peserAnimal);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the peserAnimal
        restPeserAnimalMockMvc
            .perform(delete(ENTITY_API_URL_ID, peserAnimal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return peserAnimalRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected PeserAnimal getPersistedPeserAnimal(PeserAnimal peserAnimal) {
        return peserAnimalRepository.findById(peserAnimal.getId()).orElseThrow();
    }

    protected void assertPersistedPeserAnimalToMatchAllProperties(PeserAnimal expectedPeserAnimal) {
        assertPeserAnimalAllPropertiesEquals(expectedPeserAnimal, getPersistedPeserAnimal(expectedPeserAnimal));
    }

    protected void assertPersistedPeserAnimalToMatchUpdatableProperties(PeserAnimal expectedPeserAnimal) {
        assertPeserAnimalAllUpdatablePropertiesEquals(expectedPeserAnimal, getPersistedPeserAnimal(expectedPeserAnimal));
    }
}
