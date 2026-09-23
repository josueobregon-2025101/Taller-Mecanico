import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export type tipoMovimiento=
|'Entrada'
|'Salida';

export interface MovimientoInventario {
  idmovimientos: number;
  idinventario: number;
  movimientos: tipoMovimiento;
  cantidad: number;
  fechahora: string;
  motivo:string;
  idservicio?:number;
}

export interface MovimientoInventarioFormulario{
    idInventario:number;
    movimientos:tipoMovimiento;
    cantidad:number;
    fechahora:string;
    motivo:string;
    idServicio?:number;
}

export interface CrearMovimientoResponse {
  status: string;
  message: string;
  data: MovimientoInventario;
}

export interface ActualizarMovimientoResponse {
  status: string;
  message: string;
  result: MovimientoInventario | null;
}

export interface EliminarMovimientoResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/mov-inventario';

  obtenerMovimientos(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(this.apiUrl);
  }

  obtenerMovimiento(id: number): Observable<MovimientoInventario> {
    return this.http.get<MovimientoInventario>(`${this.apiUrl}/${id}`);
  }

  crearMovimiento(
    mov: MovimientoInventarioFormulario
  ): Observable<CrearMovimientoResponse> {
    return this.http.post<CrearMovimientoResponse>(
      this.apiUrl,
      mov
    );
  }

  actualizarMovimiento(
    id: number,
    mov: MovimientoInventarioFormulario
  ): Observable<ActualizarMovimientoResponse> {
    return this.http.put<ActualizarMovimientoResponse>(
      `${this.apiUrl}/${id}`,
      mov
    );
  }

  eliminarMovimiento(
    id: number
  ): Observable<EliminarMovimientoResponse> {
    return this.http.delete<EliminarMovimientoResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}