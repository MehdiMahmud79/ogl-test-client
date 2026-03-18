import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'map',
    loadComponent: () =>
      import('../componenets/map-ui/map').then(m => m.MapTracker),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('../componenets/products/products').then(m => m.Products),
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('../componenets/customers/customers').then(m => m.Customers),
  },
  {
    path: 'customers-by-city-count',
    loadComponent: () =>
      import('../componenets/customers/customers-by-city-count')
        .then(m => m.CustomersByCityCountComponent),
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
