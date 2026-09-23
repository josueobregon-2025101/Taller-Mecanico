import { CommonModule } from '@angular/common';

import { ChangeDetectorRef,Component,OnInit
} from '@angular/core';

import { RouterLink
} from '@angular/router';

import {ActividadReciente,DashboardService,Estadisticas
} from '../../services/dashboard.service';

@Component({selector: 'app-dashboard',standalone: true,imports: [ CommonModule, RouterLink],templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  estadisticas: Estadisticas =
    this.crearEstadisticasVacias();

  actividades: ActividadReciente[] = [];

  cargandoEstadisticas: boolean = false;
  cargandoActividades: boolean = false;

  errorEstadisticas: string = '';
  errorActividades: string = '';

  ultimaActualizacion: Date | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.cargarDashboard();
  }

  cargarDashboard(): void {this.cargarEstadisticas();
    this.cargarActividadReciente();
  }

  cargarEstadisticas(): void {this.cargandoEstadisticas = true;
    this.errorEstadisticas = '';

    this.dashboardService.obtenerEstadisticas().subscribe({
        next: (respuesta) => {this.estadisticas = respuesta;
          this.cargandoEstadisticas = false;
          this.actualizarFecha();

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Error al cargar las estadísticas:',
            error
          );

          this.errorEstadisticas ='No fue posible cargar las estadísticas.';
          this.cargandoEstadisticas = false;
          this.cdr.detectChanges();
        }
      });
  }

  cargarActividadReciente(): void { this.cargandoActividades = true;
    this.errorActividades = '';

    this.dashboardService.obtenerActividadReciente().subscribe({
        next: (respuesta) => { this.actividades = respuesta;
          this.cargandoActividades = false;
          this.actualizarFecha();

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Error al cargar la actividad reciente:', error);
          this.errorActividades =
            'No fue posible cargar la actividad reciente.';
          this.cargandoActividades = false;

          this.cdr.detectChanges();
        }
      });
  }

  actualizarDashboard(): void {
    this.errorEstadisticas = '';
    this.errorActividades = '';

    this.cargarDashboard();
  }

  obtenerIconoActividad(
    tipo: string
  ): string {
    switch (tipo.toLowerCase()) {case 'servicio':
        return '🔧';

      case 'cita':
        return '📅';

      case 'inventario':
        return '📦';

      default:
        return '•';
    }
  }

  obtenerClaseActividad(
    tipo: string
  ): string {
    switch (tipo.toLowerCase()) {
      case 'servicio':
        return 'actividad-servicio';

      case 'cita':
        return 'actividad-cita';

      case 'inventario':
        return 'actividad-inventario';

      default:
        return 'actividad-general';
    }
  }

  obtenerClaseEstado(
    estado: string | null
  ): string {
    if (!estado) {
      return 'estado-neutral';
    }

    const estadoNormalizado =
      estado.toLowerCase();

    if (
      estadoNormalizado === 'terminado' ||
      estadoNormalizado === 'entregado' ||
      estadoNormalizado === 'confirmada' ||
      estadoNormalizado === 'entrada'
    ) {
      return 'estado-exito';
    }

    if (
      estadoNormalizado === 'pendiente' ||
      estadoNormalizado === 'aprobado'
    ) {
      return 'estado-pendiente';
    }

    if (
      estadoNormalizado === 'en reparación' ||
      estadoNormalizado === 'salida'
    ) {
      return 'estado-proceso';
    }

    return 'estado-neutral';
  }

  totalRegistrosPrincipales(): number {
    return (this.estadisticas.total_clientes + this.estadisticas.total_vehiculos + this.estadisticas.total_servicios +
      this.estadisticas.total_inventario
    );
  }

  private actualizarFecha(): void {
    if (
      !this.cargandoEstadisticas &&
      !this.cargandoActividades
    ) {
      this.ultimaActualizacion =
        new Date();
    }
  }

  private crearEstadisticasVacias():
    Estadisticas {
    return {total_clientes: 0,total_proveedores: 0,total_empleados: 0,total_vehiculos: 0,total_usuarios: 0,total_inventario: 0,
      total_citas: 0,total_servicios: 0,total_detalle: 0,total_movimientos: 0,total_control: 0
    };
  }
}