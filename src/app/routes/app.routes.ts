import { Routes } from '@angular/router';
import { Products } from '../componenets/products/products';
import { Customers } from '../componenets/customers/customers';
import { MapTracker } from '../componenets/map-ui/map';
export const routes: Routes = [
  {
    path: 'map',
    component: MapTracker
  }, {
    path: 'products',
    component: Products
  },
  {
    path: 'customers',
    component: Customers
  },
  // {
  //   path: 'customers',
  //   loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
  // },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: '/products'
  }
];
