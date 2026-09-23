import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Empleado,
  EmpleadoService,
  EmpleadoFormulario
} from '../../services/empleados.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})
export class Empleados implements OnInit {

  private empleadoService = inject(EmpleadoService);
  private cdr = inject(ChangeDetectorRef);

  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];

  cargando = false;
  guardando = false;
  formularioVisible = false;

  error = '';
  mensaje = '';

  empleadoEditandoId: number | null = null;

  formulario: EmpleadoFormulario = this.crearFormularioVacio();

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.cargando = true;
    this.error = '';

    this.empleadoService.obtenerEmpleados().subscribe({
      next: (respuesta) => {
        this.empleados = respuesta;
        this.empleadosFiltrados = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.error = 'No fue posible cargar los empleados.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.trim().toLowerCase();

    if (!texto) {
      this.empleadosFiltrados = this.empleados;
      return;
    }

    this.empleadosFiltrados = this.empleados.filter((empleado) =>
      empleado.nombreempleado.toLowerCase().includes(texto) ||
      empleado.apellidoempleado.toLowerCase().includes(texto) ||
      empleado.cedula.toLowerCase().includes(texto) ||
      empleado.puesto.toLowerCase().includes(texto)
    );
  }

  nuevoEmpleado(): void {
    this.empleadoEditandoId = null;
    this.formulario = this.crearFormularioVacio();
    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  editarEmpleado(empleado: Empleado): void {
    this.empleadoEditandoId = empleado.idempleado;

    this.formulario = {
      nombreEmpleado: empleado.nombreempleado,
      apellidoEmpleado: empleado.apellidoempleado,
      cedula: empleado.cedula,
      telefonoEmpleado: empleado.telefonoempleado,
      puesto: empleado.puesto,
      estadoEmpleado: empleado.estadoempleado
    };

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  guardarEmpleado(): void {
    if (!this.formularioValido()) {
      this.error = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.empleadoEditandoId === null) {
      this.crearEmpleado();
    } else {
      this.actualizarEmpleado();
    }
  }

  crearEmpleado(): void {
    this.empleadoService.crearEmpleado(this.formulario).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Empleado creado exitosamente.';
        this.formularioVisible = false;
        this.empleadoEditandoId = null;
        this.formulario = this.crearFormularioVacio();
        this.cargarEmpleados();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear empleado:', error);
        this.error = 'No fue posible crear el empleado.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarEmpleado(): void {
    if (this.empleadoEditandoId === null) return;

    this.empleadoService
      .actualizarEmpleado(this.empleadoEditandoId, this.formulario)
      .subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'Empleado actualizado exitosamente.';
          this.formularioVisible = false;
          this.empleadoEditandoId = null;
          this.formulario = this.crearFormularioVacio();
          this.cargarEmpleados();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al actualizar empleado:', error);
          this.error = 'No fue posible actualizar el empleado.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
  }

  eliminarEmpleado(empleado: Empleado): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar a "${empleado.nombreempleado} ${empleado.apellidoempleado}"?`
    );

    if (!confirmar) return;

    this.error = '';
    this.mensaje = '';

    this.empleadoService.eliminarEmpleado(empleado.idempleado).subscribe({
      next: () => {
        this.mensaje = 'Empleado eliminado exitosamente.';
        this.cargarEmpleados();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar empleado:', error);
        this.error = 'No fue posible eliminar el empleado.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarFormulario(): void {
    this.formularioVisible = false;
    this.empleadoEditandoId = null;
    this.guardando = false;
    this.formulario = this.crearFormularioVacio();
    this.error = '';
  }

  formularioValido(): boolean {
    return (
      this.formulario.nombreEmpleado.trim() !== '' &&
      this.formulario.apellidoEmpleado.trim() !== '' &&
      this.formulario.cedula.trim() !== '' &&
      this.formulario.telefonoEmpleado.trim() !== '' &&
      this.formulario.puesto !== null &&
      this.formulario.estadoEmpleado !== null
    );
  }

  crearFormularioVacio(): EmpleadoFormulario {
    return {
      nombreEmpleado: '',
      apellidoEmpleado: '',
      cedula: '',
      telefonoEmpleado: '',
      puesto: 'Mecánico',
      estadoEmpleado: 'Activo'
    };
  }
}