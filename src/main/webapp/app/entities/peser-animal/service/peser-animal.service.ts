import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IPeserAnimal, NewPeserAnimal } from '../peser-animal.model';

export type PartialUpdatePeserAnimal = Partial<IPeserAnimal> & Pick<IPeserAnimal, 'id'>;

@Injectable()
export class PeserAnimalsService {
  readonly peserAnimalsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly peserAnimalsResource = httpResource<IPeserAnimal[]>(() => {
    const params = this.peserAnimalsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of peserAnimal that have been fetched. It is updated when the peserAnimalsResource emits a new value.
   * In case of error while fetching the peserAnimals, the signal is set to an empty array.
   */
  readonly peserAnimals = computed(() => (this.peserAnimalsResource.hasValue() ? this.peserAnimalsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/peser-animals');
}

@Injectable({ providedIn: 'root' })
export class PeserAnimalService extends PeserAnimalsService {
  protected readonly http = inject(HttpClient);

  create(peserAnimal: NewPeserAnimal): Observable<IPeserAnimal> {
    return this.http.post<IPeserAnimal>(this.resourceUrl, peserAnimal);
  }

  update(peserAnimal: IPeserAnimal): Observable<IPeserAnimal> {
    return this.http.put<IPeserAnimal>(
      `${this.resourceUrl}/${encodeURIComponent(this.getPeserAnimalIdentifier(peserAnimal))}`,
      peserAnimal,
    );
  }

  partialUpdate(peserAnimal: PartialUpdatePeserAnimal): Observable<IPeserAnimal> {
    return this.http.patch<IPeserAnimal>(
      `${this.resourceUrl}/${encodeURIComponent(this.getPeserAnimalIdentifier(peserAnimal))}`,
      peserAnimal,
    );
  }

  find(id: number): Observable<IPeserAnimal> {
    return this.http.get<IPeserAnimal>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IPeserAnimal[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPeserAnimal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getPeserAnimalIdentifier(peserAnimal: Pick<IPeserAnimal, 'id'>): number {
    return peserAnimal.id;
  }

  comparePeserAnimal(o1: Pick<IPeserAnimal, 'id'> | null, o2: Pick<IPeserAnimal, 'id'> | null): boolean {
    return o1 && o2 ? this.getPeserAnimalIdentifier(o1) === this.getPeserAnimalIdentifier(o2) : o1 === o2;
  }

  addPeserAnimalToCollectionIfMissing<Type extends Pick<IPeserAnimal, 'id'>>(
    peserAnimalCollection: Type[],
    ...peserAnimalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const peserAnimals: Type[] = peserAnimalsToCheck.filter(isPresent);
    if (peserAnimals.length > 0) {
      const peserAnimalCollectionIdentifiers = peserAnimalCollection.map(peserAnimalItem => this.getPeserAnimalIdentifier(peserAnimalItem));
      const peserAnimalsToAdd = peserAnimals.filter(peserAnimalItem => {
        const peserAnimalIdentifier = this.getPeserAnimalIdentifier(peserAnimalItem);
        if (peserAnimalCollectionIdentifiers.includes(peserAnimalIdentifier)) {
          return false;
        }
        peserAnimalCollectionIdentifiers.push(peserAnimalIdentifier);
        return true;
      });
      return [...peserAnimalsToAdd, ...peserAnimalCollection];
    }
    return peserAnimalCollection;
  }
}
