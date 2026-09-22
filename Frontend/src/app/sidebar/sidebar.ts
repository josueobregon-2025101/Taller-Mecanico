import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  DashboardService,
  Estadisticas
} from '../services/dashboard.service';

import {
  AuthService,
  UsuarioSesion
} from '../services/auth.service';

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

  private authService =
    inject(AuthService);

  private router =
    inject(Router);

  private cdr =
    inject(ChangeDetectorRef);

  usuario: UsuarioSesion | null = null;

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
    this.usuario =
      this.authService.obtenerUsuario();

    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.dashboardService
      .obtenerEstadisticas()
      .subscribe({
        next: (datos) => {
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

  obtenerIniciales(): string {
    if (!this.usuario?.nombreUsuario) {
      return 'US';
    }

    return this.usuario.nombreUsuario
      .trim()
      .substring(0, 2)
      .toUpperCase();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();

    this.router.navigate([
      '/login'
    ]);
  }
}