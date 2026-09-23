import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';

import { Clientes } from './components/clientes/clientes';
import { Vehiculos } from './components/vehiculos/vehiculos';
import { InventarioComponent } from './components/inventario/inventario';
import { ServiciosComponent } from './components/servicios/servicios';
import { DetalleServiciosComponent } from './components/detalle-servicios/detalle-servicios';

import { Usuarios } from './components/usuarios/usuarios';
import { Empleados } from './components/empleados/empleados';
import { Citas } from './components/citas/citas';

import {Proveedores} from './components/proveedores/proveedores'
import { MovimientoInventarios } from './components/movimiento-inventario/movimiento-inventario';
import { ControlVentas } from './components/control-ventas/control-ventas';

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
    path: 'panel',
    component: DashboardComponent
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
    path: 'usuarios',
    component: Usuarios
  },

  {
    path: 'empleados',
    component: Empleados
  },

  {
    path: 'citas',
    component: Citas
  },
  {
    path:'proveedores',
    component:Proveedores
  },
  {
    path:'movimientos-inventario',
    component:MovimientoInventarios
  },
  {
    path:'control-ventas',
    component:ControlVentas
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];