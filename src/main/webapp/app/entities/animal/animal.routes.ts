import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import AnimalResolve from './route/animal-routing-resolve.service';

const animalRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/animal').then(m => m.Animal),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/animal-detail').then(m => m.AnimalDetail),
    resolve: {
      animal: AnimalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/animal-update').then(m => m.AnimalUpdate),
    resolve: {
      animal: AnimalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/animal-update').then(m => m.AnimalUpdate),
    resolve: {
      animal: AnimalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default animalRoute;
