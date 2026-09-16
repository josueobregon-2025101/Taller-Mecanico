import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  DashboardService,
  Estadisticas
} from '../services/dashboard.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  private dashboardService =
    inject(DashboardService);

  private cdr =
    inject(ChangeDetectorRef);


  estadisticas: Estadisticas = {

    citas: 0,

    servicios: 0,

    detallesServicios: 0,

    clientes: 0,

    vehiculos: 0,

    inventario: 0,

    proveedores: 0,

    movimientosInventario: 0,

    empleados: 0,

    usuarios: 0,

    ventas: 0

  };


  ngOnInit(): void {

    this.cargarEstadisticas();

  }


  cargarEstadisticas(): void {

    this.dashboardService
      .obtenerEstadisticas()
      .subscribe({

        next: (datos) => {

          console.log(
            'ESTADÍSTICAS:',
            datos
          );

          this.estadisticas = datos;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando estadísticas:',
            error
          );

        }

      });

  }

}