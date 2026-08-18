import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import CliniqueResolve from './route/clinique-routing-resolve.service';

const cliniqueRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/clinique').then(m => m.Clinique),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/clinique-detail').then(m => m.CliniqueDetail),
    resolve: {
      clinique: CliniqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/clinique-update').then(m => m.CliniqueUpdate),
    resolve: {
      clinique: CliniqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/clinique-update').then(m => m.CliniqueUpdate),
    resolve: {
      clinique: CliniqueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cliniqueRoute;
