package com.stg.petclinic.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MedecinTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Medecin getMedecinSample1() {
        return new Medecin().id(1L).nom("nom1").prenom("prenom1").specialite("specialite1").email("email1").telephone("telephone1");
    }

    public static Medecin getMedecinSample2() {
        return new Medecin().id(2L).nom("nom2").prenom("prenom2").specialite("specialite2").email("email2").telephone("telephone2");
    }

    public static Medecin getMedecinRandomSampleGenerator() {
        return new Medecin()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .prenom(UUID.randomUUID().toString())
            .specialite(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString());
    }
}
