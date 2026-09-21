import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PuestoEmpleado =
  | 'Mecánico'
  | 'Electromecánico'
  | 'Auxiliar'
  | 'Administrativo';

export type EstadoEmpleado = 'Activo' | 'Inactivo';

export interface Empleado {
  idempleado: number;
  nombreempleado: string;
  apellidoempleado: string;
  cedula: string;
  telefonoempleado: string;
  puesto: PuestoEmpleado;
  estadoempleado: EstadoEmpleado;
}

export interface EmpleadoResponse {
  status: string;
  message: string;
  data?: Empleado;
  result?: Empleado;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/empleados';

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  obtenerEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  crearEmpleado(empleado: Omit<Empleado, 'idempleado'>): Observable<EmpleadoResponse> {
    return this.http.post<EmpleadoResponse>(
      this.apiUrl,
      empleado
    );
  }

  actualizarEmpleado(
    id: number,
    empleado: Partial<Empleado>
  ): Observable<EmpleadoResponse> {
    return this.http.put<EmpleadoResponse>(
      `${this.apiUrl}/${id}`,
      empleado
    );
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}