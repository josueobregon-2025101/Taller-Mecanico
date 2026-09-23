import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type formaPago = 'Efectivo' | 'Tarjeta' | 'Transferencia';
export type estadoVenta = 'Pagado' | 'Pendiente' | 'Anulado';

// Lo que devuelve el backend (minúsculas)
export interface ControlVenta {
  idventas: number;
  idservicio: number;
  idcliente: number;
  fecha: string;
  subtotal: number;
  impuesto: number;
  total: number;
  forma_pago: formaPago;
  estadoventa: estadoVenta;
}

// Lo que se envía al backend (camelCase)
export interface ControlVentaFormulario {
  idServicio: number;
  idCliente: number;
  fecha: string;
  subtotal: number;
  impuesto: number;
  total: number;
  forma_pago: formaPago;
  estadoVenta: estadoVenta;
}

export interface crearControlResponse {
  status: string;
  message: string;
  data: ControlVenta;
}

export interface ActualizarControlResponse {
  status: string;
  message: string;
  result: ControlVenta | null;
}

export interface EliminarControlResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ControlVentasService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/control-venta';
  obtenerControlVentas(): Observable<ControlVenta[]> {
    return this.http.get<ControlVenta[]>(this.apiUrl);
  }

  obtenerControlVenta(id: number): Observable<ControlVenta> {
    return this.http.get<ControlVenta>(`${this.apiUrl}/${id}`);
  }

  crearControl(
    control: ControlVentaFormulario
  ): Observable<crearControlResponse> {
    return this.http.post<crearControlResponse>(
      this.apiUrl,
      control
    );
  }

  actualizarControl(
    id: number,
    control: ControlVentaFormulario
  ): Observable<ActualizarControlResponse> {
    return this.http.put<ActualizarControlResponse>(
      `${this.apiUrl}/${id}`,
      control
    );
  }

  eliminarControl(
    id: number
  ): Observable<EliminarControlResponse> {
    return this.http.delete<EliminarControlResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}