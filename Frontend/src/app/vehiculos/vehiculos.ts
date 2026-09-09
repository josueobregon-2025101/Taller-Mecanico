import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Vehiculo,
  VehiculoService
} from '../services/vehiculo.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css'
})
export class Vehiculos implements OnInit {

  private vehiculoService =
    inject(VehiculoService);

  vehiculos: Vehiculo[] = [];

  vehiculosFiltrados: Vehiculo[] = [];

  cargando = false;

  error = '';

  ngOnInit(): void {

    this.cargarVehiculos();

  }

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

        },

        error: (error) => {

          console.error(
            'Error:',
            error
          );

          this.error =
            'No se pudieron cargar los vehículos.';

          this.cargando = false;

        }

      });

  }

  buscar(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const texto =
      input.value
        .toLowerCase()
        .trim();

    this.vehiculosFiltrados =
      this.vehiculos.filter(vehiculo =>

        vehiculo.placa
          .toLowerCase()
          .includes(texto)

        ||

        vehiculo.marca
          .toLowerCase()
          .includes(texto)

        ||

        vehiculo.modelo
          .toLowerCase()
          .includes(texto)

        ||

        vehiculo.ano
          .toString()
          .includes(texto)

        ||

        vehiculo.idClientes
          .toString()
          .includes(texto)

      );

  }

  nuevoVehiculo(): void {

    console.log(
      'Abrir formulario nuevo vehículo'
    );

  }

  editarVehiculo(
    vehiculo: Vehiculo
  ): void {

    console.log(
      'Editar vehículo:',
      vehiculo
    );

  }

  eliminarVehiculo(
    vehiculo: Vehiculo
  ): void {

    const confirmar =
      confirm(
        `¿Deseas eliminar el vehículo ${vehiculo.placa}?`
      );

    if (!confirmar) {
      return;
    }

    this.vehiculoService
      .eliminarVehiculo(
        vehiculo.idVehiculo
      )
      .subscribe({

        next: () => {

          this.cargarVehiculos();

        },

        error: (error) => {

          console.error(
            'Error al eliminar:',
            error
          );

          alert(
            'No se pudo eliminar el vehículo.'
          );

        }

      });

  }

}