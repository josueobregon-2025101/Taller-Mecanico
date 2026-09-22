import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type EstadoCita = 'Pendiente' | 'Confirmada' | 'Completada';

export interface Cita {
  idcita: number;
  idvehiculo: number;
  idclientes: number;
  idempleado: number | null;
  fecha_hora: string;
  descripcion: string;
  estadocita: EstadoCita;
}

export interface CitaFormulario {
  idVehiculo: number;
  idClientes: number;
  idEmpleado: number | null;
  fecha_hora: string;
  descripcion: string;
  estadoCita: EstadoCita;
}

export interface CrearCitaResponse {
  status: string;
  message: string;
  data: Cita;
}

export interface ActualizarCitaResponse {
  status: string;
  message: string;
  result: Cita | null;
}

export interface EliminarCitaResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:3000/api/citas';

  constructor(private http: HttpClient) {}

  obtenerCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  obtenerCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  crearCita(
    cita: CitaFormulario
  ): Observable<CrearCitaResponse> {
    return this.http.post<CrearCitaResponse>(
      this.apiUrl,
      cita
    );
  }

  actualizarCita(
    id: number,
    cita: CitaFormulario
  ): Observable<ActualizarCitaResponse> {
    return this.http.put<ActualizarCitaResponse>(
      `${this.apiUrl}/${id}`,
      cita
    );
  }

  eliminarCita(
    id: number
  ): Observable<EliminarCitaResponse> {
    return this.http.delete<EliminarCitaResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}