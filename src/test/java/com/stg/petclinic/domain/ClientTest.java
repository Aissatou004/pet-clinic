package com.stg.petclinic.domain;

import static com.stg.petclinic.domain.AnimalTestSamples.*;
import static com.stg.petclinic.domain.ClientTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.stg.petclinic.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Client.class);
        Client client1 = getClientSample1();
        Client client2 = new Client();
        assertThat(client1).isNotEqualTo(client2);

        client2.setId(client1.getId());
        assertThat(client1).isEqualTo(client2);

        client2 = getClientSample2();
        assertThat(client1).isNotEqualTo(client2);
    }

    @Test
    void animalTest() {
        Client client = getClientRandomSampleGenerator();
        Animal animalBack = getAnimalRandomSampleGenerator();

        client.addAnimal(animalBack);
        assertThat(client.getAnimals()).containsOnly(animalBack);
        assertThat(animalBack.getClient()).isEqualTo(client);

        client.removeAnimal(animalBack);
        assertThat(client.getAnimals()).doesNotContain(animalBack);
        assertThat(animalBack.getClient()).isNull();

        client.animals(new HashSet<>(Set.of(animalBack)));
        assertThat(client.getAnimals()).containsOnly(animalBack);
        assertThat(animalBack.getClient()).isEqualTo(client);

        client.setAnimals(new HashSet<>());
        assertThat(client.getAnimals()).doesNotContain(animalBack);
        assertThat(animalBack.getClient()).isNull();
    }
}
