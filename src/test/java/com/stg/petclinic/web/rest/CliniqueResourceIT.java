package com.stg.petclinic.web.rest;

import static com.stg.petclinic.domain.CliniqueAsserts.*;
import static com.stg.petclinic.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stg.petclinic.IntegrationTest;
import com.stg.petclinic.domain.Clinique;
import com.stg.petclinic.repository.CliniqueRepository;
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
 * Integration tests for the {@link CliniqueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CliniqueResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/cliniques";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CliniqueRepository cliniqueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCliniqueMockMvc;

    private Clinique clinique;

    private Clinique insertedClinique;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Clinique createEntity() {
        return new Clinique().nom(DEFAULT_NOM).adresse(DEFAULT_ADRESSE).telephone(DEFAULT_TELEPHONE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Clinique createUpdatedEntity() {
        return new Clinique().nom(UPDATED_NOM).adresse(UPDATED_ADRESSE).telephone(UPDATED_TELEPHONE);
    }

    @BeforeEach
    void initTest() {
        clinique = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedClinique != null) {
            cliniqueRepository.delete(insertedClinique);
            insertedClinique = null;
        }
    }

    @Test
    @Transactional
    void createClinique() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Clinique
        var returnedClinique = om.readValue(
            restCliniqueMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clinique)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Clinique.class
        );

        // Validate the Clinique in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCliniqueUpdatableFieldsEquals(returnedClinique, getPersistedClinique(returnedClinique));

        insertedClinique = returnedClinique;
    }

    @Test
    @Transactional
    void createCliniqueWithExistingId() throws Exception {
        // Create the Clinique with an existing ID
        clinique.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCliniqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clinique)))
            .andExpect(status().isBadRequest());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        clinique.setNom(null);

        // Create the Clinique, which fails.

        restCliniqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clinique)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAdresseIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        clinique.setAdresse(null);

        // Create the Clinique, which fails.

        restCliniqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clinique)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTelephoneIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        clinique.setTelephone(null);

        // Create the Clinique, which fails.

        restCliniqueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clinique)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCliniques() throws Exception {
        // Initialize the database
        insertedClinique = cliniqueRepository.saveAndFlush(clinique);

        // Get all the cliniqueList
        restCliniqueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clinique.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)));
    }

    @Test
    @Transactional
    void getClinique() throws Exception {
        // Initialize the database
        insertedClinique = cliniqueRepository.saveAndFlush(clinique);

        // Get the clinique
        restCliniqueMockMvc
            .perform(get(ENTITY_API_URL_ID, clinique.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clinique.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE));
    }

    @Test
    @Transactional
    void getNonExistingClinique() throws Exception {
        // Get the clinique
        restCliniqueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClinique() throws Exception {
        // Initialize the database
        insertedClinique = cliniqueRepository.saveAndFlush(clinique);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clinique
        Clinique updatedClinique = cliniqueRepository.findById(clinique.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedClinique are not directly saved in db
        em.detach(updatedClinique);
        updatedClinique.nom(UPDATED_NOM).adresse(UPDATED_ADRESSE).telephone(UPDATED_TELEPHONE);

        restCliniqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClinique.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedClinique))
            )
            .andExpect(status().isOk());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCliniqueToMatchAllProperties(updatedClinique);
    }

    @Test
    @Transactional
    void putNonExistingClinique() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clinique.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCliniqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clinique.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clinique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClinique() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clinique.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCliniqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(clinique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClinique() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clinique.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCliniqueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clinique)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCliniqueWithPatch() throws Exception {
        // Initialize the database
        insertedClinique = cliniqueRepository.saveAndFlush(clinique);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clinique using partial update
        Clinique partialUpdatedClinique = new Clinique();
        partialUpdatedClinique.setId(clinique.getId());

        partialUpdatedClinique.nom(UPDATED_NOM).adresse(UPDATED_ADRESSE).telephone(UPDATED_TELEPHONE);

        restCliniqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClinique.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClinique))
            )
            .andExpect(status().isOk());

        // Validate the Clinique in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCliniqueUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedClinique, clinique), getPersistedClinique(clinique));
    }

    @Test
    @Transactional
    void fullUpdateCliniqueWithPatch() throws Exception {
        // Initialize the database
        insertedClinique = cliniqueRepository.saveAndFlush(clinique);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clinique using partial update
        Clinique partialUpdatedClinique = new Clinique();
        partialUpdatedClinique.setId(clinique.getId());

        partialUpdatedClinique.nom(UPDATED_NOM).adresse(UPDATED_ADRESSE).telephone(UPDATED_TELEPHONE);

        restCliniqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClinique.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClinique))
            )
            .andExpect(status().isOk());

        // Validate the Clinique in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCliniqueUpdatableFieldsEquals(partialUpdatedClinique, getPersistedClinique(partialUpdatedClinique));
    }

    @Test
    @Transactional
    void patchNonExistingClinique() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clinique.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCliniqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clinique.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(clinique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClinique() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clinique.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCliniqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(clinique))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClinique() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clinique.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCliniqueMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(clinique)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clinique in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClinique() throws Exception {
        // Initialize the database
        insertedClinique = cliniqueRepository.saveAndFlush(clinique);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the clinique
        restCliniqueMockMvc
            .perform(delete(ENTITY_API_URL_ID, clinique.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return cliniqueRepository.count();
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

    protected Clinique getPersistedClinique(Clinique clinique) {
        return cliniqueRepository.findById(clinique.getId()).orElseThrow();
    }

    protected void assertPersistedCliniqueToMatchAllProperties(Clinique expectedClinique) {
        assertCliniqueAllPropertiesEquals(expectedClinique, getPersistedClinique(expectedClinique));
    }

    protected void assertPersistedCliniqueToMatchUpdatableProperties(Clinique expectedClinique) {
        assertCliniqueAllUpdatablePropertiesEquals(expectedClinique, getPersistedClinique(expectedClinique));
    }
}
