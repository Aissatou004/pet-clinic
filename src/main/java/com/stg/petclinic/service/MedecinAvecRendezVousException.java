package com.stg.petclinic.service;

import com.stg.petclinic.web.rest.errors.ErrorConstants;
import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause.ProblemDetailWithCauseBuilder;

/**
 * Exception levée quand on tente de supprimer un Medecin
 * ayant des RendezVous rattachés.
 */
public class MedecinAvecRendezVousException extends ErrorResponseException {

    public MedecinAvecRendezVousException() {
        super(HttpStatus.BAD_REQUEST, asProblemDetail(), null);
    }

    private static ProblemDetailWithCause asProblemDetail() {
        return ProblemDetailWithCauseBuilder.instance()
            .withStatus(HttpStatus.BAD_REQUEST.value())
            .withType(ErrorConstants.DEFAULT_TYPE)
            .withTitle("Suppression impossible")
            .withDetail("Impossible de supprimer un médecin ayant des rendez-vous rattachés.")
            .withProperty("message", "error.medecinAvecRendezVous")
            .build();
    }
}
