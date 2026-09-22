import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService,
  LoginFormulario
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  formulario: LoginFormulario = {
    usuario: '',
    password: ''
  };

  recordar: boolean = false;
  mostrarPassword: boolean = false;
  cargando: boolean = false;

  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  iniciarSesion(): void {
    if (!this.formularioValido()) {
      this.error =
        'Ingresa tu usuario o correo y tu contraseña.';

      return;
    }

    this.cargando = true;
    this.error = '';

    const datos: LoginFormulario = {
      usuario: this.formulario.usuario.trim(),
      password: this.formulario.password
    };

    this.authService
      .login(datos)
      .subscribe({
        next: (respuesta) => {
          this.authService.guardarSesion(
            respuesta,
            this.recordar
          );

          this.cargando = false;

          this.router.navigate([
            '/panel'
          ]);

          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error(
            'Error al iniciar sesión:',
            error
          );

          this.error =
            error.error?.message ||
            'No fue posible iniciar sesión.';

          this.cargando = false;

          this.cdr.detectChanges();
        }
      });
  }

  alternarPassword(): void {
    this.mostrarPassword =
      !this.mostrarPassword;
  }

  formularioValido(): boolean {
    return (
      this.formulario.usuario.trim() !== '' &&
      this.formulario.password.trim() !== ''
    );
  }
}