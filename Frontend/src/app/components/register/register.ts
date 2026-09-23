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
  RegistroFormulario
} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  formulario: RegistroFormulario = {
    nombreUsuario: '',
    email: '',
    password: ''
  };

  confirmarPassword: string = '';

  mostrarPassword: boolean = false;
  mostrarConfirmacion: boolean = false;
  cargando: boolean = false;

  error: string = '';
  mensaje: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  registrarUsuario(): void {
    if (!this.formularioValido()) {
      return;
    }

    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    const datos: RegistroFormulario = {
      nombreUsuario:
        this.formulario.nombreUsuario.trim(),

      email:
        this.formulario.email.trim().toLowerCase(),

      password:
        this.formulario.password
    };

    this.authService
      .registrar(datos)
      .subscribe({
        next: (respuesta) => {
          this.authService.guardarSesion(
            respuesta,
            false
          );

          this.cargando = false;

          this.mensaje =
            'Cuenta creada exitosamente.';

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate([
              '/login'
            ]);
          }, 800);
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Error al registrar el usuario:',
            error
          );

          this.error =
            error.error?.message ||
            'No fue posible crear la cuenta.';

          this.cargando = false;

          this.cdr.detectChanges();
        }
      });
  }

  formularioValido(): boolean {
    this.error = '';

    if (
      this.formulario.nombreUsuario.trim() === '' ||
      this.formulario.email.trim() === '' ||
      this.formulario.password.trim() === '' ||
      this.confirmarPassword.trim() === ''
    ) {
      this.error =
        'Completa todos los campos requeridos.';

      return false;
    }

    if (!this.emailValido()) {
      this.error =
        'Ingresa un correo electrónico válido.';

      return false;
    }

    if (
      this.formulario.password.length < 8
    ) {
      this.error =
        'La contraseña debe tener al menos 8 caracteres.';

      return false;
    }

    if (
      this.formulario.password !==
      this.confirmarPassword
    ) {
      this.error =
        'Las contraseñas no coinciden.';

      return false;
    }

    return true;
  }

  emailValido(): boolean {
    const expresion =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(
      this.formulario.email.trim()
    );
  }

  alternarPassword(): void {
    this.mostrarPassword =
      !this.mostrarPassword;
  }

  alternarConfirmacion(): void {
    this.mostrarConfirmacion =
      !this.mostrarConfirmacion;
  }
}