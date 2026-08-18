package com.stg.petclinic.domain;

import static com.stg.petclinic.domain.AnimalTestSamples.*;
import static com.stg.petclinic.domain.PeserAnimalTestSamples.*;
import static com.stg.petclinic.domain.RendezVousTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.stg.petclinic.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PeserAnimalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PeserAnimal.class);
        PeserAnimal peserAnimal1 = getPeserAnimalSample1();
        PeserAnimal peserAnimal2 = new PeserAnimal();
        assertThat(peserAnimal1).isNotEqualTo(peserAnimal2);

        peserAnimal2.setId(peserAnimal1.getId());
        assertThat(peserAnimal1).isEqualTo(peserAnimal2);

        peserAnimal2 = getPeserAnimalSample2();
        assertThat(peserAnimal1).isNotEqualTo(peserAnimal2);
    }

    @Test
    void rendezVousTest() {
        PeserAnimal peserAnimal = getPeserAnimalRandomSampleGenerator();
        RendezVous rendezVousBack = getRendezVousRandomSampleGenerator();

        peserAnimal.setRendezVous(rendezVousBack);
        assertThat(peserAnimal.getRendezVous()).isEqualTo(rendezVousBack);

        peserAnimal.rendezVous(null);
        assertThat(peserAnimal.getRendezVous()).isNull();
    }

    @Test
    void animalTest() {
        PeserAnimal peserAnimal = getPeserAnimalRandomSampleGenerator();
        Animal animalBack = getAnimalRandomSampleGenerator();

        peserAnimal.setAnimal(animalBack);
        assertThat(peserAnimal.getAnimal()).isEqualTo(animalBack);

        peserAnimal.animal(null);
        assertThat(peserAnimal.getAnimal()).isNull();
    }
}
