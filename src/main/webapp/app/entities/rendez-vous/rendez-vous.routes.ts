import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import RendezVousResolve from './route/rendez-vous-routing-resolve.service';

const rendezVousRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/rendez-vous').then(m => m.RendezVous),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/rendez-vous-detail').then(m => m.RendezVousDetail),
    resolve: {
      rendezVous: RendezVousResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/rendez-vous-update').then(m => m.RendezVousUpdate),
    resolve: {
      rendezVous: RendezVousResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/rendez-vous-update').then(m => m.RendezVousUpdate),
    resolve: {
      rendezVous: RendezVousResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default rendezVousRoute;
