import { Injectable, inject } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:3000/api/estadisticas';


  obtenerEstadisticas():
    Observable<Estadisticas> {

    return this.http.get<Estadisticas>(
      `${this.apiUrl}/`
    );

  }

}