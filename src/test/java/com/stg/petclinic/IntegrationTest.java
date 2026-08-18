package com.stg.petclinic;

import com.stg.petclinic.config.AsyncSyncConfiguration;
import com.stg.petclinic.config.DatabaseTestcontainer;
import com.stg.petclinic.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.context.ImportTestcontainers;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    classes = {
        PetclinicApp.class,
        JacksonConfiguration.class,
        AsyncSyncConfiguration.class,
        com.stg.petclinic.config.JacksonHibernateConfiguration.class,
    }
)
@ImportTestcontainers(DatabaseTestcontainer.class)
public @interface IntegrationTest {}
