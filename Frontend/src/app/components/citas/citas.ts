import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Cita,
  CitaService,
  CitaFormulario
} from '../../services/citas.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {

  private citaService = inject(CitaService);
  private cdr = inject(ChangeDetectorRef);

  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];

  cargando = false;
  guardando = false;
  formularioVisible = false;

  error = '';
  mensaje = '';

  citaEditandoId: number | null = null;

  formulario: CitaFormulario = this.crearFormularioVacio();

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';

    this.citaService.obtenerCitas().subscribe({
      next: (respuesta) => {
        this.citas = respuesta;
        this.citasFiltradas = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.error = 'No fue posible cargar las citas.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.trim().toLowerCase();

    if (!texto) {
      this.citasFiltradas = this.citas;
      return;
    }

    this.citasFiltradas = this.citas.filter((cita) =>
      cita.descripcion.toLowerCase().includes(texto) ||
      cita.estadocita.toLowerCase().includes(texto)
    );
  }

  nuevaCita(): void {
    this.citaEditandoId = null;
    this.formulario = this.crearFormularioVacio();
    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  editarCita(cita: Cita): void {
    this.citaEditandoId = cita.idcita;

    this.formulario = {
      idVehiculo: cita.idvehiculo,
      idClientes: cita.idclientes,
      idEmpleado: cita.idempleado,
      fecha_hora: this.formatearFechaInput(cita.fecha_hora),
      descripcion: cita.descripcion,
      estadoCita: cita.estadocita
    };

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  guardarCita(): void {
    if (!this.formularioValido()) {
      this.error = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.citaEditandoId === null) {
      this.crearCita();
    } else {
      this.actualizarCita();
    }
  }

  crearCita(): void {
    this.citaService.crearCita(this.formulario).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Cita creada exitosamente.';
        this.formularioVisible = false;
        this.citaEditandoId = null;
        this.formulario = this.crearFormularioVacio();
        this.cargarCitas();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear cita:', error);
        this.error = 'No fue posible crear la cita.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarCita(): void {
    if (this.citaEditandoId === null) return;

    this.citaService
      .actualizarCita(this.citaEditandoId, this.formulario)
      .subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'Cita actualizada exitosamente.';
          this.formularioVisible = false;
          this.citaEditandoId = null;
          this.formulario = this.crearFormularioVacio();
          this.cargarCitas();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al actualizar cita:', error);
          this.error = 'No fue posible actualizar la cita.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
  }

  eliminarCita(cita: Cita): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar la cita #${cita.idcita}?`
    );

    if (!confirmar) return;

    this.error = '';
    this.mensaje = '';

    this.citaService.eliminarCita(cita.idcita).subscribe({
      next: () => {
        this.mensaje = 'Cita eliminada exitosamente.';
        this.cargarCitas();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar cita:', error);
        this.error = 'No fue posible eliminar la cita.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarFormulario(): void {
    this.formularioVisible = false;
    this.citaEditandoId = null;
    this.guardando = false;
    this.formulario = this.crearFormularioVacio();
    this.error = '';
  }

  formularioValido(): boolean {
    return (
      this.formulario.idVehiculo > 0 &&
      this.formulario.idClientes > 0 &&
      this.formulario.fecha_hora !== '' &&
      this.formulario.descripcion.trim() !== '' &&
      this.formulario.estadoCita !== null
    );
  }

  crearFormularioVacio(): CitaFormulario {
    return {
      idVehiculo: 0,
      idClientes: 0,
      idEmpleado: null,
      fecha_hora: '',
      descripcion: '',
      estadoCita: 'Pendiente'
    };
  }

  private formatearFechaInput(fecha: string): string {
    const d = new Date(fecha);
    const pad = (n: number) => String(n).padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}