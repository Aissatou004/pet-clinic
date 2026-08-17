package com.stg.petclinic.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CliniqueTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Clinique getCliniqueSample1() {
        return new Clinique().id(1L).nom("nom1").adresse("adresse1").telephone("telephone1");
    }

    public static Clinique getCliniqueSample2() {
        return new Clinique().id(2L).nom("nom2").adresse("adresse2").telephone("telephone2");
    }

    public static Clinique getCliniqueRandomSampleGenerator() {
        return new Clinique()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .adresse(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString());
    }
}
