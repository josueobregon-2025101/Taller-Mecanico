import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Cliente,
  ClienteService
} from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class Clientes implements OnInit {

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  cargando = false;
  error = '';
  mensaje = '';
  textoBusqueda = '';

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.error = '';

    this.clienteService.obtenerClientes().subscribe({
      next: (datos) => {
        console.log('DATOS RECIBIDOS:', datos);
        console.log('Cantidad:', datos.length);

        this.clientes = datos;
        this.clientesFiltrados = [...datos];

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error al cargar los clientes:',
          error
        );

        this.error =
          'No se pudieron cargar los clientes.';

        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.textoBusqueda =
      input.value.trim().toLowerCase();

    if (!this.textoBusqueda) {
      this.clientesFiltrados = [...this.clientes];
      return;
    }

    this.clientesFiltrados =
      this.clientes.filter((cliente) => {

        return (
          (cliente.nombrecliente ?? '')
            .toLowerCase()
            .includes(this.textoBusqueda)

          ||

          (cliente.apellido ?? '')
            .toLowerCase()
            .includes(this.textoBusqueda)

          ||

          (cliente.documento ?? '')
            .toLowerCase()
            .includes(this.textoBusqueda)

          ||

          (cliente.telefono ?? '')
            .toLowerCase()
            .includes(this.textoBusqueda)
        );
      });
  }

  nuevoCliente(): void {
    this.error = '';
    this.mensaje = '';

    console.log(
      'Abrir formulario nuevo cliente'
    );
  }

  editarCliente(
    cliente: Cliente
  ): void {

    this.error = '';
    this.mensaje = '';

    console.log(
      'Editar cliente:',
      cliente
    );
  }

  eliminarCliente(
    cliente: Cliente
  ): void {

    const confirmar = window.confirm(
      `¿Deseas eliminar a ${cliente.nombrecliente} ${cliente.apellido}?`
    );

    if (!confirmar) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.clienteService
      .eliminarCliente(cliente.idclientes)
      .subscribe({

        next: () => {

          this.mensaje =
            'Cliente eliminado exitosamente.';

          this.cargarClientes();
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al eliminar el cliente:',
            error
          );

          this.error =
            'No se pudo eliminar el cliente.';

          this.cdr.detectChanges();
        }
      });
  }
}