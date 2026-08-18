import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IPeserAnimal } from '../peser-animal.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../peser-animal.test-samples';

import { PeserAnimalService } from './peser-animal.service';

const requireRestSample: IPeserAnimal = {
  ...sampleWithRequiredData,
};

describe('PeserAnimal Service', () => {
  let service: PeserAnimalService;
  let httpMock: HttpTestingController;
  let expectedResult: IPeserAnimal | IPeserAnimal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PeserAnimalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a PeserAnimal', () => {
      const peserAnimal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(peserAnimal).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PeserAnimal', () => {
      const peserAnimal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(peserAnimal).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PeserAnimal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PeserAnimal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PeserAnimal', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests).toHaveLength(1);
    });

    describe('addPeserAnimalToCollectionIfMissing', () => {
      it('should add a PeserAnimal to an empty array', () => {
        const peserAnimal: IPeserAnimal = sampleWithRequiredData;
        expectedResult = service.addPeserAnimalToCollectionIfMissing([], peserAnimal);
        expect(expectedResult).toEqual([peserAnimal]);
      });

      it('should not add a PeserAnimal to an array that contains it', () => {
        const peserAnimal: IPeserAnimal = sampleWithRequiredData;
        const peserAnimalCollection: IPeserAnimal[] = [
          {
            ...peserAnimal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPeserAnimalToCollectionIfMissing(peserAnimalCollection, peserAnimal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PeserAnimal to an array that doesn't contain it", () => {
        const peserAnimal: IPeserAnimal = sampleWithRequiredData;
        const peserAnimalCollection: IPeserAnimal[] = [sampleWithPartialData];
        expectedResult = service.addPeserAnimalToCollectionIfMissing(peserAnimalCollection, peserAnimal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(peserAnimal);
      });

      it('should add only unique PeserAnimal to an array', () => {
        const peserAnimalArray: IPeserAnimal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const peserAnimalCollection: IPeserAnimal[] = [sampleWithRequiredData];
        expectedResult = service.addPeserAnimalToCollectionIfMissing(peserAnimalCollection, ...peserAnimalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const peserAnimal: IPeserAnimal = sampleWithRequiredData;
        const peserAnimal2: IPeserAnimal = sampleWithPartialData;
        expectedResult = service.addPeserAnimalToCollectionIfMissing([], peserAnimal, peserAnimal2);
        expect(expectedResult).toEqual([peserAnimal, peserAnimal2]);
      });

      it('should accept null and undefined values', () => {
        const peserAnimal: IPeserAnimal = sampleWithRequiredData;
        expectedResult = service.addPeserAnimalToCollectionIfMissing([], null, peserAnimal, undefined);
        expect(expectedResult).toEqual([peserAnimal]);
      });

      it('should return initial array if no PeserAnimal is added', () => {
        const peserAnimalCollection: IPeserAnimal[] = [sampleWithRequiredData];
        expectedResult = service.addPeserAnimalToCollectionIfMissing(peserAnimalCollection, undefined, null);
        expect(expectedResult).toEqual(peserAnimalCollection);
      });
    });

    describe('comparePeserAnimal', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePeserAnimal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 12626 };
        const entity2 = null;

        const compareResult1 = service.comparePeserAnimal(entity1, entity2);
        const compareResult2 = service.comparePeserAnimal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 12626 };
        const entity2 = { id: 29750 };

        const compareResult1 = service.comparePeserAnimal(entity1, entity2);
        const compareResult2 = service.comparePeserAnimal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 12626 };
        const entity2 = { id: 12626 };

        const compareResult1 = service.comparePeserAnimal(entity1, entity2);
        const compareResult2 = service.comparePeserAnimal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
