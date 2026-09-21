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

export interface CitaResponse {
  status: string;
  message: string;
  data?: Cita;
  result?: Cita;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/citas';

  obtenerCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  obtenerCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  crearCita(cita: Omit<Cita, 'idcita'>): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(
      this.apiUrl,
      cita
    );
  }

  actualizarCita(
    id: number,
    cita: Partial<Cita>
  ): Observable<CitaResponse> {
    return this.http.put<CitaResponse>(
      `${this.apiUrl}/${id}`,
      cita
    );
  }

  eliminarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}