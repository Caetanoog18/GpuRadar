import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-search/product-search').then((component) => component.ProductSearch),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites').then((component) => component.Favorites),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/search-history/search-history').then((component) => component.SearchHistory),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
