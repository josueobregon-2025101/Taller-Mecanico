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


export interface VehiculoFormulario {

  idClientes: number;

  placa: string;

  marca: string;

  modelo: string;

  ano: number;

  kilometraje_total: number;

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

  private http =
    inject(HttpClient);


  private apiUrl =
    'http://localhost:3000/api/vehiculos';

  // OBTENER TODOS
  obtenerVehiculos():
    Observable<Vehiculo[]> {

    return this.http.get<Vehiculo[]>(
      this.apiUrl
    );

  }

  // OBTENER POR ID
  obtenerVehiculo(
    id: number
  ): Observable<Vehiculo> {

    return this.http.get<Vehiculo>(
      `${this.apiUrl}/${id}`
    );

  }

  // CREAR
  crearVehiculo(
    vehiculo: VehiculoFormulario
  ): Observable<VehiculoResponse> {

    return this.http.post<VehiculoResponse>(
      this.apiUrl,
      vehiculo
    );

  }

  // ACTUALIZAR
  actualizarVehiculo(
    id: number,
    vehiculo: Partial<VehiculoFormulario>
  ): Observable<VehiculoResponse> {

    return this.http.put<VehiculoResponse>(
      `${this.apiUrl}/${id}`,
      vehiculo
    );

  }

  // ELIMINAR
  eliminarVehiculo(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}