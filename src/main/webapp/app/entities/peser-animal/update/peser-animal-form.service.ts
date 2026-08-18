import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPeserAnimal, NewPeserAnimal } from '../peser-animal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPeserAnimal for edit and NewPeserAnimalFormGroupInput for create.
 */
type PeserAnimalFormGroupInput = IPeserAnimal | PartialWithRequiredKeyOf<NewPeserAnimal>;

type PeserAnimalFormDefaults = Pick<NewPeserAnimal, 'id'>;

type PeserAnimalFormGroupContent = {
  id: FormControl<IPeserAnimal['id'] | NewPeserAnimal['id']>;
  poids: FormControl<IPeserAnimal['poids']>;
  rendezVous: FormControl<IPeserAnimal['rendezVous']>;
  animal: FormControl<IPeserAnimal['animal']>;
};

export type PeserAnimalFormGroup = FormGroup<PeserAnimalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PeserAnimalFormService {
  createPeserAnimalFormGroup(peserAnimal?: PeserAnimalFormGroupInput): PeserAnimalFormGroup {
    const peserAnimalRawValue = {
      ...this.getFormDefaults(),
      ...(peserAnimal ?? { id: null }),
    };

    return new FormGroup<PeserAnimalFormGroupContent>({
      id: new FormControl(
        { value: peserAnimalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      poids: new FormControl(peserAnimalRawValue.poids, {
        validators: [Validators.required],
      }),
      rendezVous: new FormControl(peserAnimalRawValue.rendezVous, {
        validators: [Validators.required],
      }),
      animal: new FormControl(peserAnimalRawValue.animal, {
        validators: [Validators.required],
      }),
    });
  }

  getPeserAnimal(form: PeserAnimalFormGroup): IPeserAnimal | NewPeserAnimal {
    return form.getRawValue();
  }

  resetForm(form: PeserAnimalFormGroup, peserAnimal: PeserAnimalFormGroupInput): void {
    const peserAnimalRawValue = { ...this.getFormDefaults(), ...peserAnimal };
    form.reset({
      ...peserAnimalRawValue,
      id: { value: peserAnimalRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PeserAnimalFormDefaults {
    return {
      id: null,
    };
  }
}
