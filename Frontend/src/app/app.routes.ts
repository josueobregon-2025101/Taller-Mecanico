import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

import { Clientes } from './components/clientes/clientes';
import { Vehiculos } from './components/vehiculos/vehiculos';
import { InventarioComponent } from './components/inventario/inventario';
import { ServiciosComponent } from './components/servicios/servicios';
import { DetalleServiciosComponent } from './components/detalle-servicios/detalle-servicios';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
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
    path: 'inventario',
    component: InventarioComponent
  },

  {
    path: 'servicios',
    component: ServiciosComponent
  },

  {
    path: 'detalle-servicios',
    component: DetalleServiciosComponent
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];