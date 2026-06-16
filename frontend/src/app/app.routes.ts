import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((component) => component.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register/register').then((component) => component.Register),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then((component) => component.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/product-search/product-search').then(
            (component) => component.ProductSearch,
          ),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favorites/favorites').then((component) => component.Favorites),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/search-history/search-history').then(
            (component) => component.SearchHistory,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
