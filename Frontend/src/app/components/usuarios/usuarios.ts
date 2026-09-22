import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type RolUsuario = 'Dueño' | 'Secretario';
export type EstadoUsuario = 'Activo' | 'Inactivo';

export interface Usuario {
  idusuario: number;
  nombreusuario: string;
  password: string;
  email: string;
  rol: RolUsuario;
  estadousuario: EstadoUsuario;
}

export interface UsuarioFormulario {
  nombreUsuario: string;
  password: string;
  email: string;
  rol: RolUsuario;
  estadoUsuario: EstadoUsuario;
}

export interface CrearUsuarioResponse {
  status: string;
  message: string;
  data: Usuario;
}

export interface ActualizarUsuarioResponse {
  status: string;
  message: string;
  result: Usuario | null;
}

export interface EliminarUsuarioResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(
    usuario: UsuarioFormulario
  ): Observable<CrearUsuarioResponse> {
    return this.http.post<CrearUsuarioResponse>(
      this.apiUrl,
      usuario
    );
  }

  actualizarUsuario(
    id: number,
    usuario: UsuarioFormulario
  ): Observable<ActualizarUsuarioResponse> {
    return this.http.put<ActualizarUsuarioResponse>(
      `${this.apiUrl}/${id}`,
      usuario
    );
  }

  eliminarUsuario(
    id: number
  ): Observable<EliminarUsuarioResponse> {
    return this.http.delete<EliminarUsuarioResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}