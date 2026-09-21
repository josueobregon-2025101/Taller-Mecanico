import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Usuario,
  UsuarioService
} from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  cargando = false;
  error = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.usuarioService.obtenerUsuarios().subscribe({
      next: (datos) => {
        this.usuarios = datos;
        this.usuariosFiltrados = [...datos];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = 'No se pudieron cargar los usuarios.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.toLowerCase().trim();

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombreusuario.toLowerCase().includes(texto)
      || usuario.email.toLowerCase().includes(texto)
      || usuario.rol.toLowerCase().includes(texto)
      || usuario.estadousuario.toLowerCase().includes(texto)
    );
  }

  nuevoUsuario(): void {
    console.log('Abrir formulario nuevo usuario');
  }

  editarUsuario(usuario: Usuario): void {
    console.log('Editar usuario:', usuario);
  }

  eliminarUsuario(usuario: Usuario): void {
    const confirmar = confirm(
      `¿Deseas eliminar al usuario ${usuario.nombreusuario}?`
    );

    if (!confirmar) return;

    this.usuarioService.eliminarUsuario(usuario.idusuario).subscribe({
      next: () => this.cargarUsuarios(),
      error: (error) => {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el usuario.');
      }
    });
  }
}