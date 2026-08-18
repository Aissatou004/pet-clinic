import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAnimal, NewAnimal } from '../animal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnimal for edit and NewAnimalFormGroupInput for create.
 */
type AnimalFormGroupInput = IAnimal | PartialWithRequiredKeyOf<NewAnimal>;

type AnimalFormDefaults = Pick<NewAnimal, 'id'>;

type AnimalFormGroupContent = {
  id: FormControl<IAnimal['id'] | NewAnimal['id']>;
  nom: FormControl<IAnimal['nom']>;
  espece: FormControl<IAnimal['espece']>;
  dateNaissance: FormControl<IAnimal['dateNaissance']>;
  sexe: FormControl<IAnimal['sexe']>;
  client: FormControl<IAnimal['client']>;
};

export type AnimalFormGroup = FormGroup<AnimalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AnimalFormService {
  createAnimalFormGroup(animal?: AnimalFormGroupInput): AnimalFormGroup {
    const animalRawValue = {
      ...this.getFormDefaults(),
      ...(animal ?? { id: null }),
    };

    return new FormGroup<AnimalFormGroupContent>({
      id: new FormControl(
        { value: animalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(animalRawValue.nom, {
        validators: [Validators.required],
      }),
      espece: new FormControl(animalRawValue.espece, {
        validators: [Validators.required],
      }),
      dateNaissance: new FormControl(animalRawValue.dateNaissance, {
        validators: [Validators.required],
      }),
      sexe: new FormControl(animalRawValue.sexe),
      client: new FormControl(animalRawValue.client, {
        validators: [Validators.required],
      }),
    });
  }

  getAnimal(form: AnimalFormGroup): IAnimal | NewAnimal {
    return form.getRawValue();
  }

  resetForm(form: AnimalFormGroup, animal: AnimalFormGroupInput): void {
    const animalRawValue = { ...this.getFormDefaults(), ...animal };
    form.reset({
      ...animalRawValue,
      id: { value: animalRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AnimalFormDefaults {
    return {
      id: null,
    };
  }
}
