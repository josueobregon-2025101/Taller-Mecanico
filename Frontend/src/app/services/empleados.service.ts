import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PuestoEmpleado =
  | 'Mecánico'
  | 'Electromecánico'
  | 'Auxiliar'
  | 'Administrativo';

export type EstadoEmpleado = 'Activo' | 'Inactivo';

// Lo que devuelve el backend (minúsculas)
export interface Empleado {
  idempleado: number;
  nombreempleado: string;
  apellidoempleado: string;
  cedula: string;
  telefonoempleado: string;
  puesto: PuestoEmpleado;
  estadoempleado: EstadoEmpleado;
}

// Lo que se envía al backend (camelCase)
export interface EmpleadoFormulario {
  nombreEmpleado: string;
  apellidoEmpleado: string;
  cedula: string;
  telefonoEmpleado: string;
  puesto: PuestoEmpleado;
  estadoEmpleado: EstadoEmpleado;
}

export interface CrearEmpleadoResponse {
  status: string;
  message: string;
  data: Empleado;
}

export interface ActualizarEmpleadoResponse {
  status: string;
  message: string;
  result: Empleado | null;
}

export interface EliminarEmpleadoResponse {
  status: string;
  message: string;
  result: boolean;
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

  crearEmpleado(
    empleado: EmpleadoFormulario
  ): Observable<CrearEmpleadoResponse> {
    return this.http.post<CrearEmpleadoResponse>(
      this.apiUrl,
      empleado
    );
  }

  actualizarEmpleado(
    id: number,
    empleado: EmpleadoFormulario
  ): Observable<ActualizarEmpleadoResponse> {
    return this.http.put<ActualizarEmpleadoResponse>(
      `${this.apiUrl}/${id}`,
      empleado
    );
  }

  eliminarEmpleado(
    id: number
  ): Observable<EliminarEmpleadoResponse> {
    return this.http.delete<EliminarEmpleadoResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}