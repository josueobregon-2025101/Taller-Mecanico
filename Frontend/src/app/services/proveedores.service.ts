import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Lo que devuelve el backend (minúsculas)
export interface Proveedor {
  idproveedor: number;
  nombreproveedor: string;
  ruc: string;
  telefonoproveedor: string;
}

// Lo que se envía al backend (camelCase)
export interface ProveedorFormulario {
  nombreProveedor: string;
  RUC: string;
  telefonoProveedor: string;
}

export interface CrearProveedorResponse {
  status: string;
  message: string;
  data: Proveedor;
}

export interface ActualizarProveedorResponse {
  status: string;
  message: string;
  result: Proveedor | null;
}

export interface EliminarProveedorResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/proveedores';

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  obtenerProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  crearProveedor(
    proveedor: ProveedorFormulario
  ): Observable<CrearProveedorResponse> {
    return this.http.post<CrearProveedorResponse>(
      this.apiUrl,
      proveedor
    );
  }

  actualizarProveedor(
    id: number,
    proveedor: ProveedorFormulario
  ): Observable<ActualizarProveedorResponse> {
    return this.http.put<ActualizarProveedorResponse>(
      `${this.apiUrl}/${id}`,
      proveedor
    );
  }

  eliminarProveedor(
    id: number
  ): Observable<EliminarProveedorResponse> {
    return this.http.delete<EliminarProveedorResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}