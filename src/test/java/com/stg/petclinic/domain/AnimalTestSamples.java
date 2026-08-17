package com.stg.petclinic.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AnimalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Animal getAnimalSample1() {
        return new Animal().id(1L).nom("nom1");
    }

    public static Animal getAnimalSample2() {
        return new Animal().id(2L).nom("nom2");
    }

    public static Animal getAnimalRandomSampleGenerator() {
        return new Animal().id(longCount.incrementAndGet()).nom(UUID.randomUUID().toString());
    }
}
