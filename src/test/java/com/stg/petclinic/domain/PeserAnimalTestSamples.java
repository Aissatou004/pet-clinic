package com.stg.petclinic.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class PeserAnimalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static PeserAnimal getPeserAnimalSample1() {
        return new PeserAnimal().id(1L);
    }

    public static PeserAnimal getPeserAnimalSample2() {
        return new PeserAnimal().id(2L);
    }

    public static PeserAnimal getPeserAnimalRandomSampleGenerator() {
        return new PeserAnimal().id(longCount.incrementAndGet());
    }
}
