import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioSesion {
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  rol: string;
  estadoUsuario: string;
}

export interface LoginFormulario {
  usuario: string;
  password: string;
}

export interface RegistroFormulario {
  nombreUsuario: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  usuario: UsuarioSesion;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  login(
    datos: LoginFormulario
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      datos
    );
  }

  registrar(
    datos: RegistroFormulario
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      datos
    );
  }

  guardarSesion(
    respuesta: AuthResponse,
    recordar: boolean
  ): void {
    const almacenamiento = recordar
      ? localStorage
      : sessionStorage;

    this.limpiarSesion();

    almacenamiento.setItem(
      'token',
      respuesta.token
    );

    almacenamiento.setItem(
      'usuario',
      JSON.stringify(respuesta.usuario)
    );
  }

  obtenerToken(): string | null {
    return (
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')
    );
  }

  obtenerUsuario(): UsuarioSesion | null {
    const usuarioGuardado =
      localStorage.getItem('usuario') ||
      sessionStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(
        usuarioGuardado
      ) as UsuarioSesion;
    } catch {
      return null;
    }
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  cerrarSesion(): void {
    this.limpiarSesion();
  }

  private limpiarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}