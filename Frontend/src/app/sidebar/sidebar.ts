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

    total_citas: 0,

    total_clientes: 0,

    total_control: 0,

    total_detalle: 0,

    total_empleados: 0,

    total_inventario: 0,

    total_movimientos: 0,

    total_proveedores: 0,

    total_servicios: 0,

    total_usuarios: 0,

    total_vehiculos: 0

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