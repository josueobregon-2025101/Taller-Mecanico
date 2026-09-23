import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class Clientes implements OnInit {

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  cargando = false;
  guardando = false;
  formularioVisible = false;

  error = '';
  mensaje = '';
  textoBusqueda = '';

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

  // CARGAR CLIENTES
  cargarClientes(): void {
    this.cargando = true;
    this.error = '';

    this.clienteService.obtenerClientes().subscribe({
      next: (datos) => {
        console.log('CLIENTES RECIBIDOS:', datos);

        this.clientes = datos;
        this.aplicarBusqueda();

        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('ERROR AL CARGAR CLIENTES:', error);

        this.error =
          error?.error?.message ||
          error?.error?.error ||
          'No se pudieron cargar los clientes.';

        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // BUSCAR
  buscar(valor: string): void {
    this.textoBusqueda =
      valor.trim().toLowerCase();

    this.aplicarBusqueda();
  }

  private aplicarBusqueda(): void {

    const texto =
      this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.clientesFiltrados = [
        ...this.clientes
      ];
      return;
    }

    this.clientesFiltrados =
      this.clientes.filter((cliente) =>
        String(cliente.idClientes)
          .includes(texto) ||

        String(cliente.nombrecliente ?? '')
          .toLowerCase()
          .includes(texto) ||

        String(cliente.apellido ?? '')
          .toLowerCase()
          .includes(texto) ||

        String(cliente.documento ?? '')
          .toLowerCase()
          .includes(texto) ||

        String(cliente.telefono ?? '')
          .toLowerCase()
          .includes(texto)
      );
  }

  // NUEVO CLIENTE
  nuevoCliente(): void {

    console.log('NUEVO CLIENTE');

    this.clienteEditandoId = null;

    this.formulario =
      this.crearFormularioVacio();

    this.formularioVisible = true;
    this.guardando = false;

    this.error = '';
    this.mensaje = '';
  }

  // EDITAR CLIENTE
  editarCliente(cliente: Cliente): void {

    console.log('========== EDITAR CLIENTE ==========');
    console.log('CLIENTE:', cliente);
    console.log('ID:', cliente.idClientes);

    this.clienteEditandoId =
      Number(cliente.idClientes);

    this.formulario = {
      nombrecliente:
        String(cliente.nombrecliente ?? ''),

      apellido:
        String(cliente.apellido ?? ''),

      documento:
        String(cliente.documento ?? ''),

      telefono:
        String(cliente.telefono ?? '')
    };

    this.formularioVisible = true;
    this.guardando = false;

    this.error = '';
    this.mensaje = '';

    console.log(
      'ID GUARDADO:',
      this.clienteEditandoId
    );

    console.log(
      'FORMULARIO:',
      this.formulario
    );
  }

  // GUARDAR
  guardarCliente(): void {

    console.log('========== GUARDAR ==========');

    console.log(
      'ID EDITANDO:',
      this.clienteEditandoId
    );

    console.log(
      'FORMULARIO:',
      this.formulario
    );

    if (!this.formularioValido()) {

      console.log(
        'FORMULARIO INVÁLIDO'
      );

      this.error =
        'Por favor completa todos los campos requeridos.';

      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.clienteEditandoId === null) {

      console.log(
        'MODO: CREAR'
      );

      this.crearCliente();

    } else {

      console.log(
        'MODO: ACTUALIZAR'
      );

      this.actualizarCliente();
    }
  }

  // CREAR
  crearCliente(): void {

    const datos: ClienteFormulario = {

      nombrecliente:
        this.formulario.nombrecliente.trim(),

      apellido:
        this.formulario.apellido.trim(),

      documento:
        this.formulario.documento.trim(),

      telefono:
        this.formulario.telefono.trim()
    };

    console.log(
      'CREANDO CLIENTE:',
      datos
    );

    this.clienteService
      .crearCliente(datos)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'CLIENTE CREADO:',
            respuesta
          );

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
            'ERROR AL CREAR CLIENTE:',
            error
          );

          this.error =
            error?.error?.message ||
            error?.error?.error ||
            'No se pudo crear el cliente.';

          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
  }

  // ACTUALIZAR
  actualizarCliente(): void {

    if (this.clienteEditandoId === null) {

      console.error(
        'NO EXISTE ID PARA ACTUALIZAR'
      );

      this.error =
        'No se encontró el ID del cliente.';

      this.guardando = false;

      return;
    }

    const id =
      Number(this.clienteEditandoId);

    const datos: ClienteFormulario = {

      nombrecliente:
        this.formulario.nombrecliente.trim(),

      apellido:
        this.formulario.apellido.trim(),

      documento:
        this.formulario.documento.trim(),

      telefono:
        this.formulario.telefono.trim()
    };

    console.log(
      '========== ACTUALIZANDO CLIENTE =========='
    );

    console.log(
      'ID:',
      id
    );

    console.log(
      'DATOS:',
      datos
    );

    console.log(
      'URL:',
      `http://localhost:3000/api/clientes/${id}`
    );

    this.clienteService
      .actualizarCliente(id, datos)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'CLIENTE ACTUALIZADO:',
            respuesta
          );

          this.guardando = false;

          this.mensaje =
            'Cliente actualizado exitosamente.';

          this.error = '';

          this.formularioVisible = false;
          this.clienteEditandoId = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarClientes();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            '========== ERROR AL ACTUALIZAR =========='
          );

          console.error(
            'STATUS:',
            error.status
          );

          console.error(
            'ERROR:',
            error
          );

          console.error(
            'RESPUESTA:',
            error.error
          );

          this.error =
            error?.error?.message ||
            error?.error?.error ||
            `No se pudo actualizar el cliente. Código: ${error.status}`;

          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
  }

  // ELIMINAR
  eliminarCliente(cliente: Cliente): void {

    const id =
      Number(cliente.idClientes);

    console.log(
      'CLIENTE A ELIMINAR:',
      cliente
    );

    console.log(
      'ID A ELIMINAR:',
      id
    );

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
      .eliminarCliente(id)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'CLIENTE ELIMINADO:',
            respuesta
          );

          this.mensaje =
            'Cliente eliminado exitosamente.';

          this.cargarClientes();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR AL ELIMINAR:',
            error
          );

          console.error(
            'RESPUESTA:',
            error.error
          );

          this.error =
            error?.error?.message ||
            error?.error?.error ||
            'No se pudo eliminar el cliente.';

          this.cdr.detectChanges();
        }
      });
  }

  // CANCELAR
  cancelarFormulario(): void {

    this.formularioVisible = false;

    this.clienteEditandoId = null;

    this.guardando = false;

    this.formulario =
      this.crearFormularioVacio();

    this.error = '';
  }

  // VALIDAR
  formularioValido(): boolean {

    return (

      this.formulario.nombrecliente.trim() !== '' &&

      this.formulario.apellido.trim() !== '' &&

      this.formulario.documento.trim() !== '' &&

      this.formulario.telefono.trim() !== ''
    );
  }

  // FORMULARIO VACÍO
  crearFormularioVacio(): ClienteFormulario {

    return {

      nombrecliente: '',
      apellido: '',
      documento: '',
      telefono: ''
    };
  }
}