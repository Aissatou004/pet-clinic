package com.stg.petclinic.web.rest;

import static com.stg.petclinic.domain.RendezVousAsserts.*;
import static com.stg.petclinic.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stg.petclinic.IntegrationTest;
import com.stg.petclinic.domain.Animal;
import com.stg.petclinic.domain.Clinique;
import com.stg.petclinic.domain.Medecin;
import com.stg.petclinic.domain.RendezVous;
import com.stg.petclinic.repository.RendezVousRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
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
 * Integration tests for the {@link RendezVousResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RendezVousResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.ofEpochMilli(1786978168122L);

    private static final String DEFAULT_MOTIF = "AAAAAAAAAA";
    private static final String UPDATED_MOTIF = "BBBBBBBBBB";

    private static final Double DEFAULT_DUREE = 1D;
    private static final Double UPDATED_DUREE = 2D;

    private static final String ENTITY_API_URL = "/api/rendez-vous";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRendezVousMockMvc;

    private RendezVous rendezVous;

    private RendezVous insertedRendezVous;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createEntity(EntityManager em) {
        RendezVous rendezVous = new RendezVous().date(DEFAULT_DATE).motif(DEFAULT_MOTIF).duree(DEFAULT_DUREE);
        // Add required entity
        Animal animal;
        if (TestUtil.findAll(em, Animal.class).isEmpty()) {
            animal = AnimalResourceIT.createEntity(em);
            em.persist(animal);
            em.flush();
        } else {
            animal = TestUtil.findAll(em, Animal.class).get(0);
        }
        rendezVous.setAnimal(animal);
        // Add required entity
        Clinique clinique;
        if (TestUtil.findAll(em, Clinique.class).isEmpty()) {
            clinique = CliniqueResourceIT.createEntity();
            em.persist(clinique);
            em.flush();
        } else {
            clinique = TestUtil.findAll(em, Clinique.class).get(0);
        }
        rendezVous.setClinique(clinique);
        // Add required entity
        Medecin medecin;
        if (TestUtil.findAll(em, Medecin.class).isEmpty()) {
            medecin = MedecinResourceIT.createEntity(em);
            em.persist(medecin);
            em.flush();
        } else {
            medecin = TestUtil.findAll(em, Medecin.class).get(0);
        }
        rendezVous.setMedecin(medecin);
        return rendezVous;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createUpdatedEntity(EntityManager em) {
        RendezVous updatedRendezVous = new RendezVous().date(UPDATED_DATE).motif(UPDATED_MOTIF).duree(UPDATED_DUREE);
        // Add required entity
        Animal animal;
        if (TestUtil.findAll(em, Animal.class).isEmpty()) {
            animal = AnimalResourceIT.createUpdatedEntity(em);
            em.persist(animal);
            em.flush();
        } else {
            animal = TestUtil.findAll(em, Animal.class).get(0);
        }
        updatedRendezVous.setAnimal(animal);
        // Add required entity
        Clinique clinique;
        if (TestUtil.findAll(em, Clinique.class).isEmpty()) {
            clinique = CliniqueResourceIT.createUpdatedEntity();
            em.persist(clinique);
            em.flush();
        } else {
            clinique = TestUtil.findAll(em, Clinique.class).get(0);
        }
        updatedRendezVous.setClinique(clinique);
        // Add required entity
        Medecin medecin;
        if (TestUtil.findAll(em, Medecin.class).isEmpty()) {
            medecin = MedecinResourceIT.createUpdatedEntity(em);
            em.persist(medecin);
            em.flush();
        } else {
            medecin = TestUtil.findAll(em, Medecin.class).get(0);
        }
        updatedRendezVous.setMedecin(medecin);
        return updatedRendezVous;
    }

    @BeforeEach
    void initTest() {
        rendezVous = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedRendezVous != null) {
            rendezVousRepository.delete(insertedRendezVous);
            insertedRendezVous = null;
        }
    }

    @Test
    @Transactional
    void createRendezVous() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the RendezVous
        var returnedRendezVous = om.readValue(
            restRendezVousMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rendezVous)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            RendezVous.class
        );

        // Validate the RendezVous in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertRendezVousUpdatableFieldsEquals(returnedRendezVous, getPersistedRendezVous(returnedRendezVous));

        insertedRendezVous = returnedRendezVous;
    }

    @Test
    @Transactional
    void createRendezVousWithExistingId() throws Exception {
        // Create the RendezVous with an existing ID
        rendezVous.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rendezVous)))
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        rendezVous.setDate(null);

        // Create the RendezVous, which fails.

        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rendezVous)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMotifIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        rendezVous.setMotif(null);

        // Create the RendezVous, which fails.

        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rendezVous)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDureeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        rendezVous.setDuree(null);

        // Create the RendezVous, which fails.

        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rendezVous)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRendezVouses() throws Exception {
        // Initialize the database
        insertedRendezVous = rendezVousRepository.saveAndFlush(rendezVous);

        // Get all the rendezVousList
        restRendezVousMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rendezVous.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].motif").value(hasItem(DEFAULT_MOTIF)))
            .andExpect(jsonPath("$.[*].duree").value(hasItem(DEFAULT_DUREE)));
    }

    @Test
    @Transactional
    void getRendezVous() throws Exception {
        // Initialize the database
        insertedRendezVous = rendezVousRepository.saveAndFlush(rendezVous);

        // Get the rendezVous
        restRendezVousMockMvc
            .perform(get(ENTITY_API_URL_ID, rendezVous.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rendezVous.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.motif").value(DEFAULT_MOTIF))
            .andExpect(jsonPath("$.duree").value(DEFAULT_DUREE));
    }

    @Test
    @Transactional
    void getNonExistingRendezVous() throws Exception {
        // Get the rendezVous
        restRendezVousMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRendezVous() throws Exception {
        // Initialize the database
        insertedRendezVous = rendezVousRepository.saveAndFlush(rendezVous);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rendezVous
        RendezVous updatedRendezVous = rendezVousRepository.findById(rendezVous.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRendezVous are not directly saved in db
        em.detach(updatedRendezVous);
        updatedRendezVous.date(UPDATED_DATE).motif(UPDATED_MOTIF).duree(UPDATED_DUREE);

        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRendezVous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRendezVousToMatchAllProperties(updatedRendezVous);
    }

    @Test
    @Transactional
    void putNonExistingRendezVous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rendezVous.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rendezVous.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRendezVous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rendezVous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRendezVous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rendezVous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rendezVous)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRendezVousWithPatch() throws Exception {
        // Initialize the database
        insertedRendezVous = rendezVousRepository.saveAndFlush(rendezVous);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rendezVous using partial update
        RendezVous partialUpdatedRendezVous = new RendezVous();
        partialUpdatedRendezVous.setId(rendezVous.getId());

        partialUpdatedRendezVous.date(UPDATED_DATE).duree(UPDATED_DUREE);

        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRendezVousUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedRendezVous, rendezVous),
            getPersistedRendezVous(rendezVous)
        );
    }

    @Test
    @Transactional
    void fullUpdateRendezVousWithPatch() throws Exception {
        // Initialize the database
        insertedRendezVous = rendezVousRepository.saveAndFlush(rendezVous);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rendezVous using partial update
        RendezVous partialUpdatedRendezVous = new RendezVous();
        partialUpdatedRendezVous.setId(rendezVous.getId());

        partialUpdatedRendezVous.date(UPDATED_DATE).motif(UPDATED_MOTIF).duree(UPDATED_DUREE);

        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRendezVousUpdatableFieldsEquals(partialUpdatedRendezVous, getPersistedRendezVous(partialUpdatedRendezVous));
    }

    @Test
    @Transactional
    void patchNonExistingRendezVous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rendezVous.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRendezVous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rendezVous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRendezVous() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rendezVous.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(rendezVous)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RendezVous in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRendezVous() throws Exception {
        // Initialize the database
        insertedRendezVous = rendezVousRepository.saveAndFlush(rendezVous);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the rendezVous
        restRendezVousMockMvc
            .perform(delete(ENTITY_API_URL_ID, rendezVous.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return rendezVousRepository.count();
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

    protected RendezVous getPersistedRendezVous(RendezVous rendezVous) {
        return rendezVousRepository.findById(rendezVous.getId()).orElseThrow();
    }

    protected void assertPersistedRendezVousToMatchAllProperties(RendezVous expectedRendezVous) {
        assertRendezVousAllPropertiesEquals(expectedRendezVous, getPersistedRendezVous(expectedRendezVous));
    }

    protected void assertPersistedRendezVousToMatchUpdatableProperties(RendezVous expectedRendezVous) {
        assertRendezVousAllUpdatablePropertiesEquals(expectedRendezVous, getPersistedRendezVous(expectedRendezVous));
    }
}
