import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MovimientoInventario,
  MovimientoService,
  MovimientoInventarioFormulario
} from '../../services/movimientoInventario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimiento-inventario.html',
  styleUrl: './movimiento-inventario.css'
})
export class MovimientoInventarios implements OnInit {

  private movimientoService = inject(MovimientoService);
  private cdr = inject(ChangeDetectorRef);

  movimientos: MovimientoInventario[] = [];
  movimientosFiltrados: MovimientoInventario[] = [];

  cargando = false;
  guardando = false;
  formularioVisible = false;

  error = '';
  mensaje = '';

  movimientoEditandoId: number | null = null;

  formulario: MovimientoInventarioFormulario = this.crearFormularioVacio();

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    this.cargando = true;
    this.error = '';

    this.movimientoService.obtenerMovimientos().subscribe({
      next: (respuesta) => {
        this.movimientos = respuesta;
        this.movimientosFiltrados = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar movimientos:', error);
        this.error = 'No fue posible cargar los movimientos de inventario.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value.trim().toLowerCase();

    if (!texto) {
      this.movimientosFiltrados = this.movimientos;
      return;
    }

    this.movimientosFiltrados = this.movimientos.filter((mov) =>
      mov.idinventario.toString().includes(texto) ||
      mov.movimientos.toLowerCase().includes(texto) ||
      mov.cantidad.toString().includes(texto)||
      mov.fechahora.toLowerCase().includes(texto)||
      mov.motivo.toLowerCase().includes(texto)||
      mov.idservicio?.toString().includes(texto)
    );
  }

  nuevoMovimiento(): void {
    this.movimientoEditandoId = null;
    this.formulario = this.crearFormularioVacio();
    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  editarMovimiento(mov: MovimientoInventario): void {
    this.movimientoEditandoId = mov.idmovimientos;

    this.formulario = {
      idInventario: mov.idinventario,
      movimientos: mov.movimientos,
      cantidad: mov.cantidad,
      fechahora: mov.fechahora,
      motivo: mov.motivo,
      idServicio: mov.idservicio
    };

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  guardarMovimiento(): void {
    if (!this.formularioValido()) {
      this.error = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.movimientoEditandoId === null) {
      this.crearMovimiento();
    } else {
      this.actualizarMovimiento();
    }
  }

  crearMovimiento(): void {
    this.movimientoService.crearMovimiento(this.formulario).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Movimiento Inventario creado exitosamente.';
        this.formularioVisible = false;
        this.movimientoEditandoId = null;
        this.formulario = this.crearFormularioVacio();
        this.cargarMovimientos();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear el movimiento inventario:', error);
        this.error = 'No fue posible crear el movimiento inventario.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarMovimiento(): void {
    if (this.movimientoEditandoId === null) return;

    this.movimientoService
      .actualizarMovimiento(this.movimientoEditandoId, this.formulario)
      .subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'Movimiento actualizado exitosamente.';
          this.formularioVisible = false;
          this.movimientoEditandoId = null;
          this.formulario = this.crearFormularioVacio();
          this.cargarMovimientos();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al actualizar movimientos Inventario:', error);
          this.error = 'No fue posible actualizar el movimiento inventario.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
  }

  eliminarMovimiento(mov: MovimientoInventario): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar al Movimiento Inventario "${mov.idmovimientos}"?`
    );

    if (!confirmar) return;

    this.error = '';
    this.mensaje = '';

    this.movimientoService.eliminarMovimiento(mov.idmovimientos).subscribe({
      next: () => {
        this.mensaje = 'Movimiento inventario eliminado exitosamente.';
        this.cargarMovimientos();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar movimiento:', error);
        this.error = 'No fue posible eliminar el movimiento.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarFormulario(): void {
    this.formularioVisible = false;
    this.movimientoEditandoId = null;
    this.guardando = false;
    this.formulario = this.crearFormularioVacio();
    this.error = '';
  }

  formularioValido(): boolean {
    return (
      this.formulario.idInventario >0 &&
      this.formulario.movimientos.trim() !== '' &&
      this.formulario.cantidad >=0 &&
      this.formulario.fechahora.trim() !== '' &&
      this.formulario.motivo.trim() !== '' 
    );
  }

  crearFormularioVacio(): MovimientoInventarioFormulario {
    return {
      idInventario: 0,
      movimientos: 'Entrada',
      cantidad: 0,
      fechahora:'',
      motivo:'',
      idServicio: 0,
    };
  }
}