package com.stg.petclinic.domain;

import static com.stg.petclinic.domain.CliniqueTestSamples.*;
import static com.stg.petclinic.domain.MedecinTestSamples.*;
import static com.stg.petclinic.domain.RendezVousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.stg.petclinic.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CliniqueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Clinique.class);
        Clinique clinique1 = getCliniqueSample1();
        Clinique clinique2 = new Clinique();
        assertThat(clinique1).isNotEqualTo(clinique2);

        clinique2.setId(clinique1.getId());
        assertThat(clinique1).isEqualTo(clinique2);

        clinique2 = getCliniqueSample2();
        assertThat(clinique1).isNotEqualTo(clinique2);
    }

    @Test
    void medecinTest() {
        Clinique clinique = getCliniqueRandomSampleGenerator();
        Medecin medecinBack = getMedecinRandomSampleGenerator();

        clinique.addMedecin(medecinBack);
        assertThat(clinique.getMedecins()).containsOnly(medecinBack);
        assertThat(medecinBack.getClinique()).isEqualTo(clinique);

        clinique.removeMedecin(medecinBack);
        assertThat(clinique.getMedecins()).doesNotContain(medecinBack);
        assertThat(medecinBack.getClinique()).isNull();

        clinique.medecins(new HashSet<>(Set.of(medecinBack)));
        assertThat(clinique.getMedecins()).containsOnly(medecinBack);
        assertThat(medecinBack.getClinique()).isEqualTo(clinique);

        clinique.setMedecins(new HashSet<>());
        assertThat(clinique.getMedecins()).doesNotContain(medecinBack);
        assertThat(medecinBack.getClinique()).isNull();
    }

    @Test
    void rendezVousTest() {
        Clinique clinique = getCliniqueRandomSampleGenerator();
        RendezVous rendezVousBack = getRendezVousRandomSampleGenerator();

        clinique.addRendezVous(rendezVousBack);
        assertThat(clinique.getRendezVouses()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getClinique()).isEqualTo(clinique);

        clinique.removeRendezVous(rendezVousBack);
        assertThat(clinique.getRendezVouses()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getClinique()).isNull();

        clinique.rendezVouses(new HashSet<>(Set.of(rendezVousBack)));
        assertThat(clinique.getRendezVouses()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getClinique()).isEqualTo(clinique);

        clinique.setRendezVouses(new HashSet<>());
        assertThat(clinique.getRendezVouses()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getClinique()).isNull();
    }
}
