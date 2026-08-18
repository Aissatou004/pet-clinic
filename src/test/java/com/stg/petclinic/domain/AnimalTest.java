package com.stg.petclinic.domain;

import static com.stg.petclinic.domain.AnimalTestSamples.*;
import static com.stg.petclinic.domain.ClientTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.stg.petclinic.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnimalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Animal.class);
        Animal animal1 = getAnimalSample1();
        Animal animal2 = new Animal();
        assertThat(animal1).isNotEqualTo(animal2);

        animal2.setId(animal1.getId());
        assertThat(animal1).isEqualTo(animal2);

        animal2 = getAnimalSample2();
        assertThat(animal1).isNotEqualTo(animal2);
    }

    @Test
    void clientTest() {
        Animal animal = getAnimalRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        animal.setClient(clientBack);
        assertThat(animal.getClient()).isEqualTo(clientBack);

        animal.client(null);
        assertThat(animal.getClient()).isNull();
    }
}
