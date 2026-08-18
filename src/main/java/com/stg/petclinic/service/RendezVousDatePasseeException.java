package com.stg.petclinic.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RendezVousDatePasseeException extends RuntimeException {

    public RendezVousDatePasseeException() {
        super("Impossible de créer un rendez-vous dans le passé");
    }
}
