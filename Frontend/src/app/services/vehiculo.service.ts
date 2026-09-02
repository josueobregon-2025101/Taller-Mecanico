import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehiculo {
  idVehiculo: number;
  idClientes: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  kilometraje_total: string;
}

export interface VehiculoResponse {
  status: string;
  message: string;
  data: Vehiculo;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/vehiculos';

  obtenerVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.apiUrl);
  }

  obtenerVehiculo(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(
      `${this.apiUrl}/${id}`
    );
  }

  crearVehiculo(
    vehiculo: Omit<Vehiculo, 'idVehiculo'>
  ): Observable<VehiculoResponse> {

    return this.http.post<VehiculoResponse>(
      this.apiUrl,
      vehiculo
    );
  }

  actualizarVehiculo(
    id: number,
    vehiculo: Partial<Vehiculo>
  ): Observable<VehiculoResponse> {

    return this.http.put<VehiculoResponse>(
      `${this.apiUrl}/${id}`,
      vehiculo
    );
  }

  eliminarVehiculo(id: number): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}