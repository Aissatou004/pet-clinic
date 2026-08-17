import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IClinique } from 'app/entities/clinique/clinique.model';
import { CliniqueService } from 'app/entities/clinique/service/clinique.service';
import { IMedecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';

import { MedecinFormService } from './medecin-form.service';
import { MedecinUpdate } from './medecin-update';

describe('Medecin Management Update Component', () => {
  let comp: MedecinUpdate;
  let fixture: ComponentFixture<MedecinUpdate>;
  let activatedRoute: ActivatedRoute;
  let medecinFormService: MedecinFormService;
  let medecinService: MedecinService;
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

    fixture = TestBed.createComponent(MedecinUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medecinFormService = TestBed.inject(MedecinFormService);
    medecinService = TestBed.inject(MedecinService);
    cliniqueService = TestBed.inject(CliniqueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Clinique query and add missing value', () => {
      const medecin: IMedecin = { id: 27086 };
      const clinique: IClinique = { id: 21629 };
      medecin.clinique = clinique;

      const cliniqueCollection: IClinique[] = [{ id: 21629 }];
      vitest.spyOn(cliniqueService, 'query').mockReturnValue(of(new HttpResponse({ body: cliniqueCollection })));
      const additionalCliniques = [clinique];
      const expectedCollection: IClinique[] = [...additionalCliniques, ...cliniqueCollection];
      vitest.spyOn(cliniqueService, 'addCliniqueToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      expect(cliniqueService.query).toHaveBeenCalled();
      expect(cliniqueService.addCliniqueToCollectionIfMissing).toHaveBeenCalledWith(
        cliniqueCollection,
        ...additionalCliniques.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.cliniquesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const medecin: IMedecin = { id: 27086 };
      const clinique: IClinique = { id: 21629 };
      medecin.clinique = clinique;

      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      expect(comp.cliniquesSharedCollection()).toContainEqual(clinique);
      expect(comp.medecin).toEqual(medecin);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IMedecin>();
      const medecin = { id: 19080 };
      vitest.spyOn(medecinFormService, 'getMedecin').mockReturnValue(medecin);
      vitest.spyOn(medecinService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(medecin);
      saveSubject.complete();

      // THEN
      expect(medecinFormService.getMedecin).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(medecinService.update).toHaveBeenCalledWith(expect.objectContaining(medecin));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IMedecin>();
      const medecin = { id: 19080 };
      vitest.spyOn(medecinFormService, 'getMedecin').mockReturnValue({ id: null });
      vitest.spyOn(medecinService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medecin: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(medecin);
      saveSubject.complete();

      // THEN
      expect(medecinFormService.getMedecin).toHaveBeenCalled();
      expect(medecinService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IMedecin>();
      const medecin = { id: 19080 };
      vitest.spyOn(medecinService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medecin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medecinService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClinique', () => {
      it('should forward to cliniqueService', () => {
        const entity = { id: 21629 };
        const entity2 = { id: 22256 };
        vitest.spyOn(cliniqueService, 'compareClinique');
        comp.compareClinique(entity, entity2);
        expect(cliniqueService.compareClinique).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
