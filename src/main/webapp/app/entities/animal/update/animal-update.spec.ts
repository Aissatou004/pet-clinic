import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IAnimal } from '../animal.model';
import { AnimalService } from '../service/animal.service';

import { AnimalFormService } from './animal-form.service';
import { AnimalUpdate } from './animal-update';

describe('Animal Management Update Component', () => {
  let comp: AnimalUpdate;
  let fixture: ComponentFixture<AnimalUpdate>;
  let activatedRoute: ActivatedRoute;
  let animalFormService: AnimalFormService;
  let animalService: AnimalService;
  let clientService: ClientService;

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

    fixture = TestBed.createComponent(AnimalUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    animalFormService = TestBed.inject(AnimalFormService);
    animalService = TestBed.inject(AnimalService);
    clientService = TestBed.inject(ClientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Client query and add missing value', () => {
      const animal: IAnimal = { id: 14673 };
      const client: IClient = { id: 26282 };
      animal.client = client;

      const clientCollection: IClient[] = [{ id: 26282 }];
      vitest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      vitest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ animal });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.clientsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const animal: IAnimal = { id: 14673 };
      const client: IClient = { id: 26282 };
      animal.client = client;

      activatedRoute.data = of({ animal });
      comp.ngOnInit();

      expect(comp.clientsSharedCollection()).toContainEqual(client);
      expect(comp.animal).toEqual(animal);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAnimal>();
      const animal = { id: 27263 };
      vitest.spyOn(animalFormService, 'getAnimal').mockReturnValue(animal);
      vitest.spyOn(animalService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ animal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(animal);
      saveSubject.complete();

      // THEN
      expect(animalFormService.getAnimal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(animalService.update).toHaveBeenCalledWith(expect.objectContaining(animal));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAnimal>();
      const animal = { id: 27263 };
      vitest.spyOn(animalFormService, 'getAnimal').mockReturnValue({ id: null });
      vitest.spyOn(animalService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ animal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(animal);
      saveSubject.complete();

      // THEN
      expect(animalFormService.getAnimal).toHaveBeenCalled();
      expect(animalService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAnimal>();
      const animal = { id: 27263 };
      vitest.spyOn(animalService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ animal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(animalService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClient', () => {
      it('should forward to clientService', () => {
        const entity = { id: 26282 };
        const entity2 = { id: 16836 };
        vitest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
