import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Estructura utilizada para mostrar los registros recibidos del backend
export interface Inventario {
  idinventario: number;
  nombre: string;
  descripcion: string;
  marca: string;
  categoria: string;
  stock_actual: number;
  precio_compra: number;
  precio_venta: number;
  idproveedor: number;
}

// Estructura utilizada para crear y actualizar productos
export interface InventarioFormulario {
  nombre: string;
  descripcion: string;
  marca: string;
  categoria: string;
  stock_actual: number;
  precio_compra: number;
  precio_venta: number;
  idProveedor: number;
}

// Respuesta que devuelve el backend al crear un producto
export interface CrearInventarioResponse {
  status: string;
  message: string;
  data: Inventario;
}

// Respuesta que devuelve el backend al actualizar un producto
export interface ActualizarInventarioResponse {
  status: string;
  message: string;
  result: Inventario | null;
}

// Respuesta que devuelve el backend al eliminar un producto
export interface EliminarInventarioResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private apiUrl = 'http://localhost:3000/api/inventario';

  constructor(private http: HttpClient) {}
  obtenerInventario(): Observable<Inventario[]> { 
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  obtenerProducto(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(
      `${this.apiUrl}/${id}`
    );
  }

  crearProducto(
    producto: InventarioFormulario
  ): Observable<CrearInventarioResponse> {
    return this.http.post<CrearInventarioResponse>(
    this.apiUrl,
    producto
    );
  }

  actualizarProducto(
    id: number,
    producto: InventarioFormulario
  ): Observable<ActualizarInventarioResponse> {
    return this.http.put<ActualizarInventarioResponse>(
      `${this.apiUrl}/${id}`,
      producto
    );
  }

  eliminarProducto(
    id: number
  ): Observable<EliminarInventarioResponse> {
    return this.http.delete<EliminarInventarioResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}