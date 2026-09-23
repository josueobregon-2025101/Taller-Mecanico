import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Usuario,
  UsuarioService,
  UsuarioFormulario
} from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  cargando = false;
  guardando = false;
  formularioVisible = false;

  error = '';
  mensaje = '';

  usuarioEditandoId: number | null = null;

  formulario: UsuarioFormulario = this.crearFormularioVacio();

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.usuarioService.obtenerUsuarios().subscribe({
      next: (respuesta) => {
        this.usuarios = respuesta;
        this.usuariosFiltrados = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'No fue posible cargar los usuarios.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.trim().toLowerCase();

    if (!texto) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter((usuario) =>
      usuario.nombreusuario.toLowerCase().includes(texto) ||
      usuario.email.toLowerCase().includes(texto) ||
      usuario.rol.toLowerCase().includes(texto)
    );
  }

  nuevoUsuario(): void {
    this.usuarioEditandoId = null;
    this.formulario = this.crearFormularioVacio();
    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEditandoId = usuario.idusuario;

    this.formulario = {
      nombreUsuario: usuario.nombreusuario,
      password: usuario.password,
      email: usuario.email,
      rol: usuario.rol,
      estadoUsuario: usuario.estadousuario
    };

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  guardarUsuario(): void {
    if (!this.formularioValido()) {
      this.error = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.usuarioEditandoId === null) {
      this.crearUsuario();
    } else {
      this.actualizarUsuario();
    }
  }

  crearUsuario(): void {
    this.usuarioService.crearUsuario(this.formulario).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Usuario creado exitosamente.';
        this.formularioVisible = false;
        this.usuarioEditandoId = null;
        this.formulario = this.crearFormularioVacio();
        this.cargarUsuarios();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.error = 'No fue posible crear el usuario.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarUsuario(): void {
    if (this.usuarioEditandoId === null) return;

    this.usuarioService
      .actualizarUsuario(this.usuarioEditandoId, this.formulario)
      .subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'Usuario actualizado exitosamente.';
          this.formularioVisible = false;
          this.usuarioEditandoId = null;
          this.formulario = this.crearFormularioVacio();
          this.cargarUsuarios();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.error = 'No fue posible actualizar el usuario.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
  }

  eliminarUsuario(usuario: Usuario): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar al usuario "${usuario.nombreusuario}"?`
    );

    if (!confirmar) return;

    this.error = '';
    this.mensaje = '';

    this.usuarioService.eliminarUsuario(usuario.idusuario).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado exitosamente.';
        this.cargarUsuarios();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.error = 'No fue posible eliminar el usuario.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarFormulario(): void {
    this.formularioVisible = false;
    this.usuarioEditandoId = null;
    this.guardando = false;
    this.formulario = this.crearFormularioVacio();
    this.error = '';
  }

  formularioValido(): boolean {
    return (
      this.formulario.nombreUsuario.trim() !== '' &&
      this.formulario.password.trim() !== '' &&
      this.formulario.email.trim() !== '' &&
      this.formulario.rol !== null &&
      this.formulario.estadoUsuario !== null
    );
  }

  crearFormularioVacio(): UsuarioFormulario {
    return {
      nombreUsuario: '',
      password: '',
      email: '',
      rol: 'Secretario',
      estadoUsuario: 'Activo'
    };
  }
}