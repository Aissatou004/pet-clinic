import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IClinique, NewClinique } from '../clinique.model';

export type PartialUpdateClinique = Partial<IClinique> & Pick<IClinique, 'id'>;

@Injectable()
export class CliniquesService {
  readonly cliniquesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly cliniquesResource = httpResource<IClinique[]>(() => {
    const params = this.cliniquesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of clinique that have been fetched. It is updated when the cliniquesResource emits a new value.
   * In case of error while fetching the cliniques, the signal is set to an empty array.
   */
  readonly cliniques = computed(() => (this.cliniquesResource.hasValue() ? this.cliniquesResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/cliniques');
}

@Injectable({ providedIn: 'root' })
export class CliniqueService extends CliniquesService {
  protected readonly http = inject(HttpClient);

  create(clinique: NewClinique): Observable<IClinique> {
    return this.http.post<IClinique>(this.resourceUrl, clinique);
  }

  update(clinique: IClinique): Observable<IClinique> {
    return this.http.put<IClinique>(`${this.resourceUrl}/${encodeURIComponent(this.getCliniqueIdentifier(clinique))}`, clinique);
  }

  partialUpdate(clinique: PartialUpdateClinique): Observable<IClinique> {
    return this.http.patch<IClinique>(`${this.resourceUrl}/${encodeURIComponent(this.getCliniqueIdentifier(clinique))}`, clinique);
  }

  find(id: number): Observable<IClinique> {
    return this.http.get<IClinique>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IClinique[]>> {
    const options = createRequestOption(req);
    return this.http.get<IClinique[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getCliniqueIdentifier(clinique: Pick<IClinique, 'id'>): number {
    return clinique.id;
  }

  compareClinique(o1: Pick<IClinique, 'id'> | null, o2: Pick<IClinique, 'id'> | null): boolean {
    return o1 && o2 ? this.getCliniqueIdentifier(o1) === this.getCliniqueIdentifier(o2) : o1 === o2;
  }

  addCliniqueToCollectionIfMissing<Type extends Pick<IClinique, 'id'>>(
    cliniqueCollection: Type[],
    ...cliniquesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cliniques: Type[] = cliniquesToCheck.filter(isPresent);
    if (cliniques.length > 0) {
      const cliniqueCollectionIdentifiers = cliniqueCollection.map(cliniqueItem => this.getCliniqueIdentifier(cliniqueItem));
      const cliniquesToAdd = cliniques.filter(cliniqueItem => {
        const cliniqueIdentifier = this.getCliniqueIdentifier(cliniqueItem);
        if (cliniqueCollectionIdentifiers.includes(cliniqueIdentifier)) {
          return false;
        }
        cliniqueCollectionIdentifiers.push(cliniqueIdentifier);
        return true;
      });
      return [...cliniquesToAdd, ...cliniqueCollection];
    }
    return cliniqueCollection;
  }
}
