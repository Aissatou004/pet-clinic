import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IClinique } from '../clinique.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../clinique.test-samples';

import { CliniqueService } from './clinique.service';

const requireRestSample: IClinique = {
  ...sampleWithRequiredData,
};

describe('Clinique Service', () => {
  let service: CliniqueService;
  let httpMock: HttpTestingController;
  let expectedResult: IClinique | IClinique[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CliniqueService);
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

    it('should create a Clinique', () => {
      const clinique = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clinique).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Clinique', () => {
      const clinique = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clinique).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Clinique', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Clinique', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Clinique', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests).toHaveLength(1);
    });

    describe('addCliniqueToCollectionIfMissing', () => {
      it('should add a Clinique to an empty array', () => {
        const clinique: IClinique = sampleWithRequiredData;
        expectedResult = service.addCliniqueToCollectionIfMissing([], clinique);
        expect(expectedResult).toEqual([clinique]);
      });

      it('should not add a Clinique to an array that contains it', () => {
        const clinique: IClinique = sampleWithRequiredData;
        const cliniqueCollection: IClinique[] = [
          {
            ...clinique,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCliniqueToCollectionIfMissing(cliniqueCollection, clinique);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Clinique to an array that doesn't contain it", () => {
        const clinique: IClinique = sampleWithRequiredData;
        const cliniqueCollection: IClinique[] = [sampleWithPartialData];
        expectedResult = service.addCliniqueToCollectionIfMissing(cliniqueCollection, clinique);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clinique);
      });

      it('should add only unique Clinique to an array', () => {
        const cliniqueArray: IClinique[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cliniqueCollection: IClinique[] = [sampleWithRequiredData];
        expectedResult = service.addCliniqueToCollectionIfMissing(cliniqueCollection, ...cliniqueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clinique: IClinique = sampleWithRequiredData;
        const clinique2: IClinique = sampleWithPartialData;
        expectedResult = service.addCliniqueToCollectionIfMissing([], clinique, clinique2);
        expect(expectedResult).toEqual([clinique, clinique2]);
      });

      it('should accept null and undefined values', () => {
        const clinique: IClinique = sampleWithRequiredData;
        expectedResult = service.addCliniqueToCollectionIfMissing([], null, clinique, undefined);
        expect(expectedResult).toEqual([clinique]);
      });

      it('should return initial array if no Clinique is added', () => {
        const cliniqueCollection: IClinique[] = [sampleWithRequiredData];
        expectedResult = service.addCliniqueToCollectionIfMissing(cliniqueCollection, undefined, null);
        expect(expectedResult).toEqual(cliniqueCollection);
      });
    });

    describe('compareClinique', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClinique(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 21629 };
        const entity2 = null;

        const compareResult1 = service.compareClinique(entity1, entity2);
        const compareResult2 = service.compareClinique(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 21629 };
        const entity2 = { id: 22256 };

        const compareResult1 = service.compareClinique(entity1, entity2);
        const compareResult2 = service.compareClinique(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 21629 };
        const entity2 = { id: 21629 };

        const compareResult1 = service.compareClinique(entity1, entity2);
        const compareResult2 = service.compareClinique(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
