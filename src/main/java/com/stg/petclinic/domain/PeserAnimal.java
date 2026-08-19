package com.stg.petclinic.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PeserAnimal.
 */
@Entity
@Table(name = "peser_animal")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PeserAnimal implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "poids", nullable = false)
    @DecimalMin(value = "0.0", inclusive = false)
    @Positive
    private Double poids;

    @JsonIgnoreProperties(value = { "animal", "clinique", "medecin", "peserAnimal" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private RendezVous rendezVous;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "client" }, allowSetters = true)
    private Animal animal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PeserAnimal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPoids() {
        return this.poids;
    }

    public PeserAnimal poids(Double poids) {
        this.setPoids(poids);
        return this;
    }

    public void setPoids(Double poids) {
        this.poids = poids;
    }

    public RendezVous getRendezVous() {
        return this.rendezVous;
    }

    public void setRendezVous(RendezVous rendezVous) {
        this.rendezVous = rendezVous;
    }

    public PeserAnimal rendezVous(RendezVous rendezVous) {
        this.setRendezVous(rendezVous);
        return this;
    }

    public Animal getAnimal() {
        return this.animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public PeserAnimal animal(Animal animal) {
        this.setAnimal(animal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PeserAnimal)) {
            return false;
        }
        return getId() != null && getId().equals(((PeserAnimal) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PeserAnimal{" +
            "id=" + getId() +
            ", poids=" + getPoids() +
            "}";
    }
}
