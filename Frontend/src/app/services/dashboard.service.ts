import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estadisticas {
  total_clientes: number;
  total_proveedores: number;
  total_empleados: number;
  total_vehiculos: number;
  total_usuarios: number;
  total_inventario: number;
  total_citas: number;
  total_servicios: number;
  total_detalle: number;
  total_movimientos: number;
  total_control: number;
}

export interface ActividadReciente {
  tipo: string;
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl =
    'http://localhost:3000/api/estadisticas';

  constructor(
    private http: HttpClient
  ) {}

  obtenerEstadisticas():
    Observable<Estadisticas> {
    return this.http.get<Estadisticas>(
      this.apiUrl
    );
  }

  obtenerActividadReciente():
    Observable<ActividadReciente[]> {
    return this.http.get<ActividadReciente[]>(
      `${this.apiUrl}/actividad-reciente`
    );
  }
}