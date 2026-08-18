import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IRendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';

const rendezVousResolve = (route: ActivatedRouteSnapshot): Observable<null | IRendezVous> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(RendezVousService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default rendezVousResolve;
