import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Cliente,
  ClienteService
} from '../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  private clienteService = inject(ClienteService);

  clientes: Cliente[] = [];

  clientesFiltrados: Cliente[] = [];

  cargando = false;

  error = '';

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {

    this.cargando = true;
    this.error = '';

    this.clienteService.obtenerClientes().subscribe({

      next: (datos) => {

        this.clientes = datos;

        this.clientesFiltrados = [...datos];

        this.cargando = false;

      },

      error: (error) => {

        console.error('Error:', error);

        this.error =
          'No se pudieron cargar los clientes.';

        this.cargando = false;

      }

    });

  }

  buscar(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const texto =
      input.value.toLowerCase().trim();

    this.clientesFiltrados =
      this.clientes.filter(cliente =>

        cliente.nombreCliente
          .toLowerCase()
          .includes(texto)

        ||

        cliente.apellido
          .toLowerCase()
          .includes(texto)

        ||

        cliente.documento
          .toLowerCase()
          .includes(texto)

        ||

        cliente.telefono
          .toLowerCase()
          .includes(texto)

      );

  }

  nuevoCliente(): void {

    console.log('Abrir formulario nuevo cliente');

  }

  editarCliente(cliente: Cliente): void {

    console.log(
      'Editar cliente:',
      cliente
    );

  }

  eliminarCliente(cliente: Cliente): void {

    const confirmar =
      confirm(
        `¿Deseas eliminar a ${cliente.nombreCliente} ${cliente.apellido}?`
      );

    if (!confirmar) {
      return;
    }

    this.clienteService
      .eliminarCliente(cliente.idClientes)
      .subscribe({

        next: () => {

          this.cargarClientes();

        },

        error: (error) => {

          console.error(
            'Error al eliminar:',
            error
          );

          alert(
            'No se pudo eliminar el cliente.'
          );

        }

      });

  }

}