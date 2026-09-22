import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Vehiculo,
  VehiculoFormulario,
  VehiculoService
} from '../../services/vehiculo.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css'
})
export class Vehiculos implements OnInit {

  private vehiculoService =
    inject(VehiculoService);

  private cdr =
    inject(ChangeDetectorRef);


  // =========================
  // LISTADO
  // =========================

  vehiculos: Vehiculo[] = [];

  vehiculosFiltrados: Vehiculo[] = [];


  // =========================
  // ESTADOS
  // =========================

  cargando: boolean = false;

  guardando: boolean = false;

  formularioVisible: boolean = false;


  // =========================
  // MENSAJES
  // =========================

  error: string = '';

  mensaje: string = '';

  textoBusqueda: string = '';


  // =========================
  // EDICIÓN
  // =========================

  vehiculoEditandoId: number | null = null;


  // =========================
  // FORMULARIO
  // =========================

  formulario: VehiculoFormulario =
    this.crearFormularioVacio();


  // =========================
  // INICIO
  // =========================

  ngOnInit(): void {

    this.cargarVehiculos();

  }


  // =========================
  // CARGAR VEHÍCULOS
  // =========================

  cargarVehiculos(): void {

    this.cargando = true;

    this.error = '';

    this.vehiculoService
      .obtenerVehiculos()
      .subscribe({

        next: (datos) => {

          this.vehiculos = datos;

          this.vehiculosFiltrados =
            [...datos];

          this.cargando = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al cargar los vehículos:',
            error
          );

          this.error =
            'No se pudieron cargar los vehículos.';

          this.cargando = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // BUSCAR
  // =========================

  buscar(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.textoBusqueda =
      input.value
        .trim()
        .toLowerCase();


    // Si no hay texto,
    // mostrar todos los vehículos

    if (!this.textoBusqueda) {

      this.vehiculosFiltrados =
        this.vehiculos;

      return;

    }


    this.vehiculosFiltrados =
      this.vehiculos.filter(
        (vehiculo) => {

          return (

            vehiculo.placa
              .toLowerCase()
              .includes(
                this.textoBusqueda
              )

            ||

            vehiculo.marca
              .toLowerCase()
              .includes(
                this.textoBusqueda
              )

            ||

            vehiculo.modelo
              .toLowerCase()
              .includes(
                this.textoBusqueda
              )

            ||

            vehiculo.ano
              .toString()
              .includes(
                this.textoBusqueda
              )

            ||

            vehiculo.idClientes
              .toString()
              .includes(
                this.textoBusqueda
              )

          );

        }
      );

  }


  // =========================
  // NUEVO VEHÍCULO
  // =========================

  nuevoVehiculo(): void {

    this.vehiculoEditandoId = null;

    this.formulario =
      this.crearFormularioVacio();

    this.formularioVisible = true;

    this.guardando = false;

    this.error = '';

    this.mensaje = '';

  }


  // =========================
  // EDITAR VEHÍCULO
  // =========================

  editarVehiculo(
    vehiculo: Vehiculo
  ): void {

    this.vehiculoEditandoId =
      vehiculo.idVehiculo;


    this.formulario = {

      idClientes:
        Number(vehiculo.idClientes),

      placa:
        vehiculo.placa,

      marca:
        vehiculo.marca,

      modelo:
        vehiculo.modelo,

      ano:
        Number(vehiculo.ano),

      kilometraje_total:
        Number(vehiculo.kilometraje_total)

    };


    this.formularioVisible = true;

    this.guardando = false;

    this.error = '';

    this.mensaje = '';

  }


  // =========================
  // GUARDAR
  // =========================

  guardarVehiculo(): void {

    if (!this.formularioValido()) {

      this.error =
        'Por favor completa todos los campos requeridos.';

      return;

    }


    this.guardando = true;

    this.error = '';

    this.mensaje = '';


    if (
      this.vehiculoEditandoId === null
    ) {

      this.crearVehiculo();

    } else {

      this.actualizarVehiculo();

    }

  }


  // =========================
  // CREAR VEHÍCULO
  // =========================

  crearVehiculo(): void {

    this.vehiculoService
      .crearVehiculo(this.formulario)
      .subscribe({

        next: () => {

          this.guardando = false;

          this.mensaje =
            'Vehículo creado exitosamente.';

          this.formularioVisible = false;

          this.vehiculoEditandoId = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarVehiculos();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al crear el vehículo:',
            error
          );

          this.error =
            'No fue posible crear el vehículo.';

          this.guardando = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // ACTUALIZAR VEHÍCULO
  // =========================

  actualizarVehiculo(): void {

    if (
      this.vehiculoEditandoId === null
    ) {

      return;

    }


    this.vehiculoService
      .actualizarVehiculo(
        this.vehiculoEditandoId,
        this.formulario
      )
      .subscribe({

        next: () => {

          this.guardando = false;

          this.mensaje =
            'Vehículo actualizado exitosamente.';

          this.formularioVisible = false;

          this.vehiculoEditandoId = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarVehiculos();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al actualizar el vehículo:',
            error
          );

          this.error =
            'No fue posible actualizar el vehículo.';

          this.guardando = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // ELIMINAR VEHÍCULO
  // =========================

  eliminarVehiculo(
    vehiculo: Vehiculo
  ): void {

    const confirmar =
      window.confirm(
        `¿Deseas eliminar el vehículo "${vehiculo.placa}"?`
      );


    if (!confirmar) {

      return;

    }


    this.error = '';

    this.mensaje = '';


    this.vehiculoService
      .eliminarVehiculo(
        vehiculo.idVehiculo
      )
      .subscribe({

        next: () => {

          this.mensaje =
            'Vehículo eliminado exitosamente.';

          this.cargarVehiculos();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al eliminar el vehículo:',
            error
          );

          this.error =
            'No fue posible eliminar el vehículo.';

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // CANCELAR FORMULARIO
  // =========================

  cancelarFormulario(): void {

    this.formularioVisible = false;

    this.vehiculoEditandoId = null;

    this.guardando = false;

    this.formulario =
      this.crearFormularioVacio();

    this.error = '';

  }


  // =========================
  // VALIDAR FORMULARIO
  // =========================

  formularioValido(): boolean {

    return (

      this.formulario.idClientes > 0 &&

      this.formulario.placa
        .trim() !== '' &&

      this.formulario.marca
        .trim() !== '' &&

      this.formulario.modelo
        .trim() !== '' &&

      this.formulario.ano >= 1900 &&

      this.formulario.kilometraje_total >= 0

    );

  }


  // =========================
  // FORMULARIO VACÍO
  // =========================

  crearFormularioVacio():
    VehiculoFormulario {

    return {

      idClientes: 0,

      placa: '',

      marca: '',

      modelo: '',

      ano: new Date().getFullYear(),

      kilometraje_total: 0

    };

  }

}