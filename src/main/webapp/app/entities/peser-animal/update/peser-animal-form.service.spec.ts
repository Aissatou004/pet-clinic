import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../peser-animal.test-samples';

import { PeserAnimalFormService } from './peser-animal-form.service';

describe('PeserAnimal Form Service', () => {
  let service: PeserAnimalFormService;

  beforeEach(() => {
    service = TestBed.inject(PeserAnimalFormService);
  });

  describe('Service methods', () => {
    describe('createPeserAnimalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPeserAnimalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            poids: expect.any(Object),
            rendezVous: expect.any(Object),
            animal: expect.any(Object),
          }),
        );
      });

      it('passing IPeserAnimal should create a new form with FormGroup', () => {
        const formGroup = service.createPeserAnimalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            poids: expect.any(Object),
            rendezVous: expect.any(Object),
            animal: expect.any(Object),
          }),
        );
      });
    });

    describe('getPeserAnimal', () => {
      it('should return NewPeserAnimal for default PeserAnimal initial value', () => {
        const formGroup = service.createPeserAnimalFormGroup(sampleWithNewData);

        const peserAnimal = service.getPeserAnimal(formGroup);

        expect(peserAnimal).toMatchObject(sampleWithNewData);
      });

      it('should return NewPeserAnimal for empty PeserAnimal initial value', () => {
        const formGroup = service.createPeserAnimalFormGroup();

        const peserAnimal = service.getPeserAnimal(formGroup);

        expect(peserAnimal).toMatchObject({});
      });

      it('should return IPeserAnimal', () => {
        const formGroup = service.createPeserAnimalFormGroup(sampleWithRequiredData);

        const peserAnimal = service.getPeserAnimal(formGroup);

        expect(peserAnimal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPeserAnimal should not enable id FormControl', () => {
        const formGroup = service.createPeserAnimalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPeserAnimal should disable id FormControl', () => {
        const formGroup = service.createPeserAnimalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
