import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IMedecin, NewMedecin } from '../medecin.model';

export type PartialUpdateMedecin = Partial<IMedecin> & Pick<IMedecin, 'id'>;

@Injectable()
export class MedecinsService {
  readonly medecinsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly medecinsResource = httpResource<IMedecin[]>(() => {
    const params = this.medecinsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of medecin that have been fetched. It is updated when the medecinsResource emits a new value.
   * In case of error while fetching the medecins, the signal is set to an empty array.
   */
  readonly medecins = computed(() => (this.medecinsResource.hasValue() ? this.medecinsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/medecins');
}

@Injectable({ providedIn: 'root' })
export class MedecinService extends MedecinsService {
  protected readonly http = inject(HttpClient);

  create(medecin: NewMedecin): Observable<IMedecin> {
    return this.http.post<IMedecin>(this.resourceUrl, medecin);
  }

  update(medecin: IMedecin): Observable<IMedecin> {
    return this.http.put<IMedecin>(`${this.resourceUrl}/${encodeURIComponent(this.getMedecinIdentifier(medecin))}`, medecin);
  }

  partialUpdate(medecin: PartialUpdateMedecin): Observable<IMedecin> {
    return this.http.patch<IMedecin>(`${this.resourceUrl}/${encodeURIComponent(this.getMedecinIdentifier(medecin))}`, medecin);
  }

  find(id: number): Observable<IMedecin> {
    return this.http.get<IMedecin>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IMedecin[]>> {
    const options = createRequestOption(req);
    return this.http.get<IMedecin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getMedecinIdentifier(medecin: Pick<IMedecin, 'id'>): number {
    return medecin.id;
  }

  compareMedecin(o1: Pick<IMedecin, 'id'> | null, o2: Pick<IMedecin, 'id'> | null): boolean {
    return o1 && o2 ? this.getMedecinIdentifier(o1) === this.getMedecinIdentifier(o2) : o1 === o2;
  }

  addMedecinToCollectionIfMissing<Type extends Pick<IMedecin, 'id'>>(
    medecinCollection: Type[],
    ...medecinsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const medecins: Type[] = medecinsToCheck.filter(isPresent);
    if (medecins.length > 0) {
      const medecinCollectionIdentifiers = medecinCollection.map(medecinItem => this.getMedecinIdentifier(medecinItem));
      const medecinsToAdd = medecins.filter(medecinItem => {
        const medecinIdentifier = this.getMedecinIdentifier(medecinItem);
        if (medecinCollectionIdentifiers.includes(medecinIdentifier)) {
          return false;
        }
        medecinCollectionIdentifiers.push(medecinIdentifier);
        return true;
      });
      return [...medecinsToAdd, ...medecinCollection];
    }
    return medecinCollection;
  }
}
