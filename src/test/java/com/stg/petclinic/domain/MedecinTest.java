package com.stg.petclinic.domain;

import static com.stg.petclinic.domain.CliniqueTestSamples.*;
import static com.stg.petclinic.domain.MedecinTestSamples.*;
import static com.stg.petclinic.domain.RendezVousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.stg.petclinic.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MedecinTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Medecin.class);
        Medecin medecin1 = getMedecinSample1();
        Medecin medecin2 = new Medecin();
        assertThat(medecin1).isNotEqualTo(medecin2);

        medecin2.setId(medecin1.getId());
        assertThat(medecin1).isEqualTo(medecin2);

        medecin2 = getMedecinSample2();
        assertThat(medecin1).isNotEqualTo(medecin2);
    }

    @Test
    void rendezVousTest() {
        Medecin medecin = getMedecinRandomSampleGenerator();
        RendezVous rendezVousBack = getRendezVousRandomSampleGenerator();

        medecin.addRendezVous(rendezVousBack);
        assertThat(medecin.getRendezVouses()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getMedecin()).isEqualTo(medecin);

        medecin.removeRendezVous(rendezVousBack);
        assertThat(medecin.getRendezVouses()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getMedecin()).isNull();

        medecin.rendezVouses(new HashSet<>(Set.of(rendezVousBack)));
        assertThat(medecin.getRendezVouses()).containsOnly(rendezVousBack);
        assertThat(rendezVousBack.getMedecin()).isEqualTo(medecin);

        medecin.setRendezVouses(new HashSet<>());
        assertThat(medecin.getRendezVouses()).doesNotContain(rendezVousBack);
        assertThat(rendezVousBack.getMedecin()).isNull();
    }

    @Test
    void cliniqueTest() {
        Medecin medecin = getMedecinRandomSampleGenerator();
        Clinique cliniqueBack = getCliniqueRandomSampleGenerator();

        medecin.setClinique(cliniqueBack);
        assertThat(medecin.getClinique()).isEqualTo(cliniqueBack);

        medecin.clinique(null);
        assertThat(medecin.getClinique()).isNull();
    }
}
