import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estadisticas {

  citas: number;

  servicios: number;

  detallesServicios: number;

  clientes: number;

  vehiculos: number;

  inventario: number;

  proveedores: number;

  movimientosInventario: number;

  empleados: number;

  usuarios: number;

  ventas: number;

}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:3000/api/dashboard';


  obtenerEstadisticas():
    Observable<Estadisticas> {

    return this.http.get<Estadisticas>(
      `${this.apiUrl}/estadisticas`
    );

  }

}