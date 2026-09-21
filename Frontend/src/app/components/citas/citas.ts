import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Cita,
  CitaService
} from '../../services/citas.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {

  private citaService = inject(CitaService);
  private cdr = inject(ChangeDetectorRef);

  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];

  cargando = false;
  error = '';

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';

    this.citaService.obtenerCitas().subscribe({
      next: (datos) => {
        this.citas = datos;
        this.citasFiltradas = [...datos];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = 'No se pudieron cargar las citas.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.toLowerCase().trim();

    this.citasFiltradas = this.citas.filter(cita =>
      cita.descripcion.toLowerCase().includes(texto)
      || cita.estadocita.toLowerCase().includes(texto)
      || String(cita.idvehiculo).includes(texto)
      || String(cita.idclientes).includes(texto)
    );
  }

  nuevaCita(): void {
    console.log('Abrir formulario nueva cita');
  }

  editarCita(cita: Cita): void {
    console.log('Editar cita:', cita);
  }

  eliminarCita(cita: Cita): void {
    const confirmar = confirm(
      `¿Deseas eliminar la cita #${cita.idcita}?`
    );

    if (!confirmar) return;

    this.citaService.eliminarCita(cita.idcita).subscribe({
      next: () => this.cargarCitas(),
      error: (error) => {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar la cita.');
      }
    });
  }
}