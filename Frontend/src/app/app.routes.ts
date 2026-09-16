import { Routes } from '@angular/router';

import { Clientes } from './components/clientes/clientes';
import { Vehiculos } from './components/vehiculos/vehiculos';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'clientes',
    pathMatch: 'full'
  },

  {
    path: 'clientes',
    component: Clientes
  },

  {
    path: 'vehiculos',
    component: Vehiculos
  },

  {
    path: '**',
    redirectTo: 'clientes'
  }

];
