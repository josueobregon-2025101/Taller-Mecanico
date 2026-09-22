import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  idClientes: number;
  nombrecliente: string;
  apellido: string;
  documento: string;
  telefono: string;
}

export interface ClienteResponse {
  status: string;
  message: string;
  data: Cliente;
}

export type ClienteDatos =
  Omit<Cliente, 'idClientes'>;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:3000/api/clientes';

  // OBTENER TODOS
  obtenerClientes(): Observable<Cliente[]> {

    return this.http.get<Cliente[]>(
      this.apiUrl
    );
  }

  // OBTENER POR ID
  obtenerCliente(
    id: number
  ): Observable<Cliente> {

    return this.http.get<Cliente>(
      `${this.apiUrl}/${id}`
    );
  }

  // CREAR
  crearCliente(
    cliente: ClienteDatos
  ): Observable<ClienteResponse> {

    console.log(
      'POST CLIENTE:',
      cliente
    );

    return this.http.post<ClienteResponse>(
      this.apiUrl,
      cliente
    );
  }

  // ACTUALIZAR
  actualizarCliente(
    id: number,
    cliente: ClienteDatos
  ): Observable<ClienteResponse> {

    console.log(
      'PUT CLIENTE:',
      `${this.apiUrl}/${id}`
    );

    console.log(
      'DATOS PUT:',
      cliente
    );

    return this.http.put<ClienteResponse>(
      `${this.apiUrl}/${id}`,
      cliente
    );
  }

  // ELIMINAR
  eliminarCliente(
    id: number
  ): Observable<any> {

    console.log(
      'DELETE CLIENTE:',
      `${this.apiUrl}/${id}`
    );

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}