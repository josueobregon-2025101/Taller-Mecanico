import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Empleado,
  EmpleadoService
} from '../../services/empleados.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})
export class Empleados implements OnInit {

  private empleadoService = inject(EmpleadoService);
  private cdr = inject(ChangeDetectorRef);

  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];

  cargando = false;
  error = '';

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.cargando = true;
    this.error = '';

    this.empleadoService.obtenerEmpleados().subscribe({
      next: (datos) => {
        this.empleados = datos;
        this.empleadosFiltrados = [...datos];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = 'No se pudieron cargar los empleados.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.toLowerCase().trim();

    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.nombreempleado.toLowerCase().includes(texto)
      || empleado.apellidoempleado.toLowerCase().includes(texto)
      || empleado.cedula.toLowerCase().includes(texto)
      || empleado.puesto.toLowerCase().includes(texto)
    );
  }

  nuevoEmpleado(): void {
    console.log('Abrir formulario nuevo empleado');
  }

  editarEmpleado(empleado: Empleado): void {
    console.log('Editar empleado:', empleado);
  }

  eliminarEmpleado(empleado: Empleado): void {
    const confirmar = confirm(
      `¿Deseas eliminar a ${empleado.nombreempleado} ${empleado.apellidoempleado}?`
    );

    if (!confirmar) return;

    this.empleadoService.eliminarEmpleado(empleado.idempleado).subscribe({
      next: () => this.cargarEmpleados(),
      error: (error) => {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el empleado.');
      }
    });
  }
}