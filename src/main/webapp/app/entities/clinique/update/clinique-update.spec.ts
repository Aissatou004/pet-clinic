import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IClinique } from '../clinique.model';
import { CliniqueService } from '../service/clinique.service';

import { CliniqueFormService } from './clinique-form.service';
import { CliniqueUpdate } from './clinique-update';

describe('Clinique Management Update Component', () => {
  let comp: CliniqueUpdate;
  let fixture: ComponentFixture<CliniqueUpdate>;
  let activatedRoute: ActivatedRoute;
  let cliniqueFormService: CliniqueFormService;
  let cliniqueService: CliniqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(CliniqueUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cliniqueFormService = TestBed.inject(CliniqueFormService);
    cliniqueService = TestBed.inject(CliniqueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const clinique: IClinique = { id: 22256 };

      activatedRoute.data = of({ clinique });
      comp.ngOnInit();

      expect(comp.clinique).toEqual(clinique);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IClinique>();
      const clinique = { id: 21629 };
      vitest.spyOn(cliniqueFormService, 'getClinique').mockReturnValue(clinique);
      vitest.spyOn(cliniqueService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clinique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(clinique);
      saveSubject.complete();

      // THEN
      expect(cliniqueFormService.getClinique).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cliniqueService.update).toHaveBeenCalledWith(expect.objectContaining(clinique));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IClinique>();
      const clinique = { id: 21629 };
      vitest.spyOn(cliniqueFormService, 'getClinique').mockReturnValue({ id: null });
      vitest.spyOn(cliniqueService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clinique: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(clinique);
      saveSubject.complete();

      // THEN
      expect(cliniqueFormService.getClinique).toHaveBeenCalled();
      expect(cliniqueService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IClinique>();
      const clinique = { id: 21629 };
      vitest.spyOn(cliniqueService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clinique });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cliniqueService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
