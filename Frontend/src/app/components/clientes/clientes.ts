import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

import {
  Cliente,
  ClienteService
} from '../../services/clientes.service';

interface ClienteFormulario {
  nombrecliente: string;
  apellido: string;
  documento: string;
  telefono: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class Clientes implements OnInit {

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  cargando: boolean = false;
  guardando: boolean = false;
  formularioVisible: boolean = false;

  error: string = '';
  mensaje: string = '';
  textoBusqueda: string = '';

  clienteEditandoId: number | null = null;

  formulario: ClienteFormulario =
    this.crearFormularioVacio();

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

    this.clienteService
      .obtenerClientes()
      .subscribe({
        next: (datos) => {

          console.log(
            'DATOS RECIBIDOS:',
            datos
          );

          this.clientes = datos;
          this.clientesFiltrados = datos;

          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al cargar clientes:',
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
      input.value
        .trim()
        .toLowerCase();

    if (!this.textoBusqueda) {

      this.clientesFiltrados =
        this.clientes;

      return;
    }

    this.clientesFiltrados =
      this.clientes.filter(
        (cliente) => {

          return (

            cliente.nombrecliente
              .toLowerCase()
              .includes(this.textoBusqueda)

            ||

            cliente.apellido
              .toLowerCase()
              .includes(this.textoBusqueda)

            ||

            cliente.documento
              .toLowerCase()
              .includes(this.textoBusqueda)

            ||

            cliente.telefono
              .toLowerCase()
              .includes(this.textoBusqueda)

          );
        }
      );
  }

  nuevoCliente(): void {

    this.clienteEditandoId = null;

    this.formulario =
      this.crearFormularioVacio();

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  editarCliente(
    cliente: Cliente
  ): void {

    this.clienteEditandoId =
      cliente.idclientes;

    this.formulario = {

      nombrecliente:
        cliente.nombrecliente,

      apellido:
        cliente.apellido,

      documento:
        cliente.documento,

      telefono:
        cliente.telefono

    };

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  guardarCliente(): void {

    if (!this.formularioValido()) {

      this.error =
        'Por favor completa todos los campos requeridos.';

      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (
      this.clienteEditandoId === null
    ) {

      this.crearCliente();

    } else {

      this.actualizarCliente();
    }
  }

  crearCliente(): void {

    this.clienteService
      .crearCliente(this.formulario)
      .subscribe({

        next: () => {

          this.guardando = false;

          this.mensaje =
            'Cliente creado exitosamente.';

          this.formularioVisible = false;

          this.clienteEditandoId = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarClientes();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al crear cliente:',
            error
          );

          this.error =
            'No se pudo crear el cliente.';

          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
  }

  actualizarCliente(): void {

    if (
      this.clienteEditandoId === null
    ) {
      return;
    }

    this.clienteService
      .actualizarCliente(
        this.clienteEditandoId,
        this.formulario
      )
      .subscribe({

        next: () => {

          this.guardando = false;

          this.mensaje =
            'Cliente actualizado exitosamente.';

          this.formularioVisible = false;

          this.clienteEditandoId = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarClientes();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al actualizar cliente:',
            error
          );

          this.error =
            'No se pudo actualizar el cliente.';

          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
  }

  eliminarCliente(
    cliente: Cliente
  ): void {

    const confirmar =
      window.confirm(
        `¿Deseas eliminar a ${cliente.nombrecliente} ${cliente.apellido}?`
      );

    if (!confirmar) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.clienteService
      .eliminarCliente(
        cliente.idclientes
      )
      .subscribe({

        next: () => {

          this.mensaje =
            'Cliente eliminado exitosamente.';

          this.cargarClientes();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al eliminar cliente:',
            error
          );

          this.error =
            'No se pudo eliminar el cliente.';

          this.cdr.detectChanges();
        }
      });
  }

  cancelarFormulario(): void {

    this.formularioVisible = false;

    this.clienteEditandoId = null;

    this.guardando = false;

    this.formulario =
      this.crearFormularioVacio();

    this.error = '';
  }

  formularioValido(): boolean {

    return (

      this.formulario.nombrecliente
        .trim() !== ''

      &&

      this.formulario.apellido
        .trim() !== ''

      &&

      this.formulario.documento
        .trim() !== ''

      &&

      this.formulario.telefono
        .trim() !== ''

    );
  }

  crearFormularioVacio(): ClienteFormulario {

    return {

      nombrecliente: '',
      apellido: '',
      documento: '',
      telefono: ''

    };
  }
}