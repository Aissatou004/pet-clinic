import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'petclinicApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'user-management',
    data: { pageTitle: 'userManagement.home.title' },
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  {
    path: 'clinique',
    data: { pageTitle: 'petclinicApp.clinique.home.title' },
    loadChildren: () => import('./clinique/clinique.routes'),
  },
  {
    path: 'medecin',
    data: { pageTitle: 'petclinicApp.medecin.home.title' },
    loadChildren: () => import('./medecin/medecin.routes'),
  },
  {
    path: 'client',
    data: { pageTitle: 'petclinicApp.client.home.title' },
    loadChildren: () => import('./client/client.routes'),
  },
  {
    path: 'animal',
    data: { pageTitle: 'petclinicApp.animal.home.title' },
    loadChildren: () => import('./animal/animal.routes'),
  },
  {
    path: 'rendez-vous',
    data: { pageTitle: 'petclinicApp.rendezVous.home.title' },
    loadChildren: () => import('./rendez-vous/rendez-vous.routes'),
  },
  {
    path: 'peser-animal',
    data: { pageTitle: 'petclinicApp.peserAnimal.home.title' },
    loadChildren: () => import('./peser-animal/peser-animal.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
