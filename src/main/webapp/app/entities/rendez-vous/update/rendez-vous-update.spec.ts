import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAnimal } from 'app/entities/animal/animal.model';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { IClinique } from 'app/entities/clinique/clinique.model';
import { CliniqueService } from 'app/entities/clinique/service/clinique.service';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { MedecinService } from 'app/entities/medecin/service/medecin.service';
import { IRendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';

import { RendezVousFormService } from './rendez-vous-form.service';
import { RendezVousUpdate } from './rendez-vous-update';

describe('RendezVous Management Update Component', () => {
  let comp: RendezVousUpdate;
  let fixture: ComponentFixture<RendezVousUpdate>;
  let activatedRoute: ActivatedRoute;
  let rendezVousFormService: RendezVousFormService;
  let rendezVousService: RendezVousService;
  let animalService: AnimalService;
  let cliniqueService: CliniqueService;
  let medecinService: MedecinService;

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

    fixture = TestBed.createComponent(RendezVousUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rendezVousFormService = TestBed.inject(RendezVousFormService);
    rendezVousService = TestBed.inject(RendezVousService);
    animalService = TestBed.inject(AnimalService);
    cliniqueService = TestBed.inject(CliniqueService);
    medecinService = TestBed.inject(MedecinService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Animal query and add missing value', () => {
      const rendezVous: IRendezVous = { id: 6733 };
      const animal: IAnimal = { id: 27263 };
      rendezVous.animal = animal;

      const animalCollection: IAnimal[] = [{ id: 27263 }];
      vitest.spyOn(animalService, 'query').mockReturnValue(of(new HttpResponse({ body: animalCollection })));
      const additionalAnimals = [animal];
      const expectedCollection: IAnimal[] = [...additionalAnimals, ...animalCollection];
      vitest.spyOn(animalService, 'addAnimalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rendezVous });
      comp.ngOnInit();

      expect(animalService.query).toHaveBeenCalled();
      expect(animalService.addAnimalToCollectionIfMissing).toHaveBeenCalledWith(
        animalCollection,
        ...additionalAnimals.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.animalsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Clinique query and add missing value', () => {
      const rendezVous: IRendezVous = { id: 6733 };
      const clinique: IClinique = { id: 21629 };
      rendezVous.clinique = clinique;

      const cliniqueCollection: IClinique[] = [{ id: 21629 }];
      vitest.spyOn(cliniqueService, 'query').mockReturnValue(of(new HttpResponse({ body: cliniqueCollection })));
      const additionalCliniques = [clinique];
      const expectedCollection: IClinique[] = [...additionalCliniques, ...cliniqueCollection];
      vitest.spyOn(cliniqueService, 'addCliniqueToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rendezVous });
      comp.ngOnInit();

      expect(cliniqueService.query).toHaveBeenCalled();
      expect(cliniqueService.addCliniqueToCollectionIfMissing).toHaveBeenCalledWith(
        cliniqueCollection,
        ...additionalCliniques.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.cliniquesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Medecin query and add missing value', () => {
      const rendezVous: IRendezVous = { id: 6733 };
      const medecin: IMedecin = { id: 19080 };
      rendezVous.medecin = medecin;

      const medecinCollection: IMedecin[] = [{ id: 19080 }];
      vitest.spyOn(medecinService, 'query').mockReturnValue(of(new HttpResponse({ body: medecinCollection })));
      const additionalMedecins = [medecin];
      const expectedCollection: IMedecin[] = [...additionalMedecins, ...medecinCollection];
      vitest.spyOn(medecinService, 'addMedecinToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rendezVous });
      comp.ngOnInit();

      expect(medecinService.query).toHaveBeenCalled();
      expect(medecinService.addMedecinToCollectionIfMissing).toHaveBeenCalledWith(
        medecinCollection,
        ...additionalMedecins.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.medecinsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const rendezVous: IRendezVous = { id: 6733 };
      const animal: IAnimal = { id: 27263 };
      rendezVous.animal = animal;
      const clinique: IClinique = { id: 21629 };
      rendezVous.clinique = clinique;
      const medecin: IMedecin = { id: 19080 };
      rendezVous.medecin = medecin;

      activatedRoute.data = of({ rendezVous });
      comp.ngOnInit();

      expect(comp.animalsSharedCollection()).toContainEqual(animal);
      expect(comp.cliniquesSharedCollection()).toContainEqual(clinique);
      expect(comp.medecinsSharedCollection()).toContainEqual(medecin);
      expect(comp.rendezVous).toEqual(rendezVous);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IRendezVous>();
      const rendezVous = { id: 18994 };
      vitest.spyOn(rendezVousFormService, 'getRendezVous').mockReturnValue(rendezVous);
      vitest.spyOn(rendezVousService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rendezVous });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(rendezVous);
      saveSubject.complete();

      // THEN
      expect(rendezVousFormService.getRendezVous).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rendezVousService.update).toHaveBeenCalledWith(expect.objectContaining(rendezVous));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IRendezVous>();
      const rendezVous = { id: 18994 };
      vitest.spyOn(rendezVousFormService, 'getRendezVous').mockReturnValue({ id: null });
      vitest.spyOn(rendezVousService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rendezVous: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(rendezVous);
      saveSubject.complete();

      // THEN
      expect(rendezVousFormService.getRendezVous).toHaveBeenCalled();
      expect(rendezVousService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IRendezVous>();
      const rendezVous = { id: 18994 };
      vitest.spyOn(rendezVousService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rendezVous });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rendezVousService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAnimal', () => {
      it('should forward to animalService', () => {
        const entity = { id: 27263 };
        const entity2 = { id: 14673 };
        vitest.spyOn(animalService, 'compareAnimal');
        comp.compareAnimal(entity, entity2);
        expect(animalService.compareAnimal).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClinique', () => {
      it('should forward to cliniqueService', () => {
        const entity = { id: 21629 };
        const entity2 = { id: 22256 };
        vitest.spyOn(cliniqueService, 'compareClinique');
        comp.compareClinique(entity, entity2);
        expect(cliniqueService.compareClinique).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMedecin', () => {
      it('should forward to medecinService', () => {
        const entity = { id: 19080 };
        const entity2 = { id: 27086 };
        vitest.spyOn(medecinService, 'compareMedecin');
        comp.compareMedecin(entity, entity2);
        expect(medecinService.compareMedecin).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
