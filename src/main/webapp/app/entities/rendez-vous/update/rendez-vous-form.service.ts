import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRendezVous, NewRendezVous } from '../rendez-vous.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRendezVous for edit and NewRendezVousFormGroupInput for create.
 */
type RendezVousFormGroupInput = IRendezVous | PartialWithRequiredKeyOf<NewRendezVous>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRendezVous | NewRendezVous> = Omit<T, 'date'> & {
  date?: string | null;
};

type RendezVousFormRawValue = FormValueOf<IRendezVous>;

type NewRendezVousFormRawValue = FormValueOf<NewRendezVous>;

type RendezVousFormDefaults = Pick<NewRendezVous, 'id' | 'date'>;

type RendezVousFormGroupContent = {
  id: FormControl<RendezVousFormRawValue['id'] | NewRendezVous['id']>;
  date: FormControl<RendezVousFormRawValue['date']>;
  motif: FormControl<RendezVousFormRawValue['motif']>;
  duree: FormControl<RendezVousFormRawValue['duree']>;
  animal: FormControl<RendezVousFormRawValue['animal']>;
  clinique: FormControl<RendezVousFormRawValue['clinique']>;
  medecin: FormControl<RendezVousFormRawValue['medecin']>;
};

export type RendezVousFormGroup = FormGroup<RendezVousFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RendezVousFormService {
  createRendezVousFormGroup(rendezVous?: RendezVousFormGroupInput): RendezVousFormGroup {
    const rendezVousRawValue = this.convertRendezVousToRendezVousRawValue({
      ...this.getFormDefaults(),
      ...(rendezVous ?? { id: null }),
    });

    return new FormGroup<RendezVousFormGroupContent>({
      id: new FormControl(
        { value: rendezVousRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(rendezVousRawValue.date, {
        validators: [Validators.required],
      }),
      motif: new FormControl(rendezVousRawValue.motif, {
        validators: [Validators.required],
      }),
      duree: new FormControl(rendezVousRawValue.duree, {
        validators: [Validators.required],
      }),
      animal: new FormControl(rendezVousRawValue.animal, {
        validators: [Validators.required],
      }),
      clinique: new FormControl(rendezVousRawValue.clinique, {
        validators: [Validators.required],
      }),
      medecin: new FormControl(rendezVousRawValue.medecin, {
        validators: [Validators.required],
      }),
    });
  }

  getRendezVous(form: RendezVousFormGroup): IRendezVous | NewRendezVous {
    return this.convertRendezVousRawValueToRendezVous(form.getRawValue());
  }

  resetForm(form: RendezVousFormGroup, rendezVous: RendezVousFormGroupInput): void {
    const rendezVousRawValue = this.convertRendezVousToRendezVousRawValue({ ...this.getFormDefaults(), ...rendezVous });
    form.reset({
      ...rendezVousRawValue,
      id: { value: rendezVousRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): RendezVousFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertRendezVousRawValueToRendezVous(
    rawRendezVous: RendezVousFormRawValue | NewRendezVousFormRawValue,
  ): IRendezVous | NewRendezVous {
    return {
      ...rawRendezVous,
      date: dayjs(rawRendezVous.date, DATE_TIME_FORMAT),
    };
  }

  private convertRendezVousToRendezVousRawValue(
    rendezVous: IRendezVous | (Partial<NewRendezVous> & RendezVousFormDefaults),
  ): RendezVousFormRawValue | PartialWithRequiredKeyOf<NewRendezVousFormRawValue> {
    return {
      ...rendezVous,
      date: rendezVous.date ? rendezVous.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
