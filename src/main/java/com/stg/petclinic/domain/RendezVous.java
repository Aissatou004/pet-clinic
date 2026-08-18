package com.stg.petclinic.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RendezVous.
 */
@Entity
@Table(name = "rendez_vous")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RendezVous implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @NotNull
    @Column(name = "motif", nullable = false)
    private String motif;

    @NotNull
    @Column(name = "duree", nullable = false)
    private Double duree;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "client" }, allowSetters = true)
    private Animal animal;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "medecins", "rendezVouses" }, allowSetters = true)
    private Clinique clinique;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "rendezVouses", "clinique" }, allowSetters = true)
    private Medecin medecin;

    @JsonIgnoreProperties(value = { "rendezVous", "animal" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "rendezVous")
    private PeserAnimal peserAnimal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RendezVous id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public RendezVous date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getMotif() {
        return this.motif;
    }

    public RendezVous motif(String motif) {
        this.setMotif(motif);
        return this;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public Double getDuree() {
        return this.duree;
    }

    public RendezVous duree(Double duree) {
        this.setDuree(duree);
        return this;
    }

    public void setDuree(Double duree) {
        this.duree = duree;
    }

    public Animal getAnimal() {
        return this.animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public RendezVous animal(Animal animal) {
        this.setAnimal(animal);
        return this;
    }

    public Clinique getClinique() {
        return this.clinique;
    }

    public void setClinique(Clinique clinique) {
        this.clinique = clinique;
    }

    public RendezVous clinique(Clinique clinique) {
        this.setClinique(clinique);
        return this;
    }

    public Medecin getMedecin() {
        return this.medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public RendezVous medecin(Medecin medecin) {
        this.setMedecin(medecin);
        return this;
    }

    public PeserAnimal getPeserAnimal() {
        return this.peserAnimal;
    }

    public void setPeserAnimal(PeserAnimal peserAnimal) {
        if (this.peserAnimal != null) {
            this.peserAnimal.setRendezVous(null);
        }
        if (peserAnimal != null) {
            peserAnimal.setRendezVous(this);
        }
        this.peserAnimal = peserAnimal;
    }

    public RendezVous peserAnimal(PeserAnimal peserAnimal) {
        this.setPeserAnimal(peserAnimal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RendezVous)) {
            return false;
        }
        return getId() != null && getId().equals(((RendezVous) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RendezVous{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", motif='" + getMotif() + "'" +
            ", duree=" + getDuree() +
            "}";
    }
}
