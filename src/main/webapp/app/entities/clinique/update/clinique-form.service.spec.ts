import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../clinique.test-samples';

import { CliniqueFormService } from './clinique-form.service';

describe('Clinique Form Service', () => {
  let service: CliniqueFormService;

  beforeEach(() => {
    service = TestBed.inject(CliniqueFormService);
  });

  describe('Service methods', () => {
    describe('createCliniqueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCliniqueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            adresse: expect.any(Object),
            telephone: expect.any(Object),
          }),
        );
      });

      it('passing IClinique should create a new form with FormGroup', () => {
        const formGroup = service.createCliniqueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            adresse: expect.any(Object),
            telephone: expect.any(Object),
          }),
        );
      });
    });

    describe('getClinique', () => {
      it('should return NewClinique for default Clinique initial value', () => {
        const formGroup = service.createCliniqueFormGroup(sampleWithNewData);

        const clinique = service.getClinique(formGroup);

        expect(clinique).toMatchObject(sampleWithNewData);
      });

      it('should return NewClinique for empty Clinique initial value', () => {
        const formGroup = service.createCliniqueFormGroup();

        const clinique = service.getClinique(formGroup);

        expect(clinique).toMatchObject({});
      });

      it('should return IClinique', () => {
        const formGroup = service.createCliniqueFormGroup(sampleWithRequiredData);

        const clinique = service.getClinique(formGroup);

        expect(clinique).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClinique should not enable id FormControl', () => {
        const formGroup = service.createCliniqueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClinique should disable id FormControl', () => {
        const formGroup = service.createCliniqueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
