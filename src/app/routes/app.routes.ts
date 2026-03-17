import { Routes } from '@angular/router';
import { Products } from '../componenets/products/products';
import { Customers } from '../componenets/customers/customers';
export const routes: Routes = [
  {
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
