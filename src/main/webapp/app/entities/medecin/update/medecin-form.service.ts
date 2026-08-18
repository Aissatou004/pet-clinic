import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IMedecin, NewMedecin } from '../medecin.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMedecin for edit and NewMedecinFormGroupInput for create.
 */
type MedecinFormGroupInput = IMedecin | PartialWithRequiredKeyOf<NewMedecin>;

type MedecinFormDefaults = Pick<NewMedecin, 'id'>;

type MedecinFormGroupContent = {
  id: FormControl<IMedecin['id'] | NewMedecin['id']>;
  nom: FormControl<IMedecin['nom']>;
  prenom: FormControl<IMedecin['prenom']>;
  specialite: FormControl<IMedecin['specialite']>;
  email: FormControl<IMedecin['email']>;
  telephone: FormControl<IMedecin['telephone']>;
  clinique: FormControl<IMedecin['clinique']>;
};

export type MedecinFormGroup = FormGroup<MedecinFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MedecinFormService {
  createMedecinFormGroup(medecin?: MedecinFormGroupInput): MedecinFormGroup {
    const medecinRawValue = {
      ...this.getFormDefaults(),
      ...(medecin ?? { id: null }),
    };

    return new FormGroup<MedecinFormGroupContent>({
      id: new FormControl(
        { value: medecinRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(medecinRawValue.nom, {
        validators: [Validators.required],
      }),
      prenom: new FormControl(medecinRawValue.prenom, {
        validators: [Validators.required],
      }),
      specialite: new FormControl(medecinRawValue.specialite, {
        validators: [Validators.required],
      }),
      email: new FormControl(medecinRawValue.email, {
        validators: [
          Validators.required,
          Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'), // NOSONAR
        ],
      }),
      telephone: new FormControl(medecinRawValue.telephone),
      clinique: new FormControl(medecinRawValue.clinique, {
        validators: [Validators.required],
      }),
    });
  }

  getMedecin(form: MedecinFormGroup): IMedecin | NewMedecin {
    return form.getRawValue();
  }

  resetForm(form: MedecinFormGroup, medecin: MedecinFormGroupInput): void {
    const medecinRawValue = { ...this.getFormDefaults(), ...medecin };
    form.reset({
      ...medecinRawValue,
      id: { value: medecinRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): MedecinFormDefaults {
    return {
      id: null,
    };
  }
}
