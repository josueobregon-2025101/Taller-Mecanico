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

export interface UsuarioResponse {
  status: string;
  message: string;
  data?: Usuario;
  result?: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/usuarios';

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(usuario: Omit<Usuario, 'idusuario'>): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(
      this.apiUrl,
      usuario
    );
  }

  actualizarUsuario(
    id: number,
    usuario: Partial<Usuario>
  ): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(
      `${this.apiUrl}/${id}`,
      usuario
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}