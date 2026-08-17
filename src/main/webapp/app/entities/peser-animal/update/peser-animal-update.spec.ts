import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAnimal } from 'app/entities/animal/animal.model';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';
import { RendezVousService } from 'app/entities/rendez-vous/service/rendez-vous.service';
import { IPeserAnimal } from '../peser-animal.model';
import { PeserAnimalService } from '../service/peser-animal.service';

import { PeserAnimalFormService } from './peser-animal-form.service';
import { PeserAnimalUpdate } from './peser-animal-update';

describe('PeserAnimal Management Update Component', () => {
  let comp: PeserAnimalUpdate;
  let fixture: ComponentFixture<PeserAnimalUpdate>;
  let activatedRoute: ActivatedRoute;
  let peserAnimalFormService: PeserAnimalFormService;
  let peserAnimalService: PeserAnimalService;
  let rendezVousService: RendezVousService;
  let animalService: AnimalService;

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

    fixture = TestBed.createComponent(PeserAnimalUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    peserAnimalFormService = TestBed.inject(PeserAnimalFormService);
    peserAnimalService = TestBed.inject(PeserAnimalService);
    rendezVousService = TestBed.inject(RendezVousService);
    animalService = TestBed.inject(AnimalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call rendezVous query and add missing value', () => {
      const peserAnimal: IPeserAnimal = { id: 29750 };
      const rendezVous: IRendezVous = { id: 18994 };
      peserAnimal.rendezVous = rendezVous;

      const rendezVousCollection: IRendezVous[] = [{ id: 18994 }];
      vitest.spyOn(rendezVousService, 'query').mockReturnValue(of(new HttpResponse({ body: rendezVousCollection })));
      const expectedCollection: IRendezVous[] = [rendezVous, ...rendezVousCollection];
      vitest.spyOn(rendezVousService, 'addRendezVousToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ peserAnimal });
      comp.ngOnInit();

      expect(rendezVousService.query).toHaveBeenCalled();
      expect(rendezVousService.addRendezVousToCollectionIfMissing).toHaveBeenCalledWith(rendezVousCollection, rendezVous);
      expect(comp.rendezVousesCollection()).toEqual(expectedCollection);
    });

    it('should call Animal query and add missing value', () => {
      const peserAnimal: IPeserAnimal = { id: 29750 };
      const animal: IAnimal = { id: 27263 };
      peserAnimal.animal = animal;

      const animalCollection: IAnimal[] = [{ id: 27263 }];
      vitest.spyOn(animalService, 'query').mockReturnValue(of(new HttpResponse({ body: animalCollection })));
      const additionalAnimals = [animal];
      const expectedCollection: IAnimal[] = [...additionalAnimals, ...animalCollection];
      vitest.spyOn(animalService, 'addAnimalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ peserAnimal });
      comp.ngOnInit();

      expect(animalService.query).toHaveBeenCalled();
      expect(animalService.addAnimalToCollectionIfMissing).toHaveBeenCalledWith(
        animalCollection,
        ...additionalAnimals.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.animalsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const peserAnimal: IPeserAnimal = { id: 29750 };
      const rendezVous: IRendezVous = { id: 18994 };
      peserAnimal.rendezVous = rendezVous;
      const animal: IAnimal = { id: 27263 };
      peserAnimal.animal = animal;

      activatedRoute.data = of({ peserAnimal });
      comp.ngOnInit();

      expect(comp.rendezVousesCollection()).toContainEqual(rendezVous);
      expect(comp.animalsSharedCollection()).toContainEqual(animal);
      expect(comp.peserAnimal).toEqual(peserAnimal);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPeserAnimal>();
      const peserAnimal = { id: 12626 };
      vitest.spyOn(peserAnimalFormService, 'getPeserAnimal').mockReturnValue(peserAnimal);
      vitest.spyOn(peserAnimalService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ peserAnimal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(peserAnimal);
      saveSubject.complete();

      // THEN
      expect(peserAnimalFormService.getPeserAnimal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(peserAnimalService.update).toHaveBeenCalledWith(expect.objectContaining(peserAnimal));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPeserAnimal>();
      const peserAnimal = { id: 12626 };
      vitest.spyOn(peserAnimalFormService, 'getPeserAnimal').mockReturnValue({ id: null });
      vitest.spyOn(peserAnimalService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ peserAnimal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(peserAnimal);
      saveSubject.complete();

      // THEN
      expect(peserAnimalFormService.getPeserAnimal).toHaveBeenCalled();
      expect(peserAnimalService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IPeserAnimal>();
      const peserAnimal = { id: 12626 };
      vitest.spyOn(peserAnimalService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ peserAnimal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(peserAnimalService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRendezVous', () => {
      it('should forward to rendezVousService', () => {
        const entity = { id: 18994 };
        const entity2 = { id: 6733 };
        vitest.spyOn(rendezVousService, 'compareRendezVous');
        comp.compareRendezVous(entity, entity2);
        expect(rendezVousService.compareRendezVous).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAnimal', () => {
      it('should forward to animalService', () => {
        const entity = { id: 27263 };
        const entity2 = { id: 14673 };
        vitest.spyOn(animalService, 'compareAnimal');
        comp.compareAnimal(entity, entity2);
        expect(animalService.compareAnimal).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
