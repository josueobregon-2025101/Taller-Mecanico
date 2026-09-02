import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  idClientes: number;
  nombreCliente: string;
  apellido: string;
  documento: string;
  telefono: string;
}

export interface ClienteResponse {
  status: string;
  message: string;
  data: Cliente;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/clientes';

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  crearCliente(cliente: Omit<Cliente, 'idClientes'>): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(
      this.apiUrl,
      cliente
    );
  }

  actualizarCliente(
    id: number,
    cliente: Partial<Cliente>
  ): Observable<ClienteResponse> {

    return this.http.put<ClienteResponse>(
      `${this.apiUrl}/${id}`,
      cliente
    );
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}