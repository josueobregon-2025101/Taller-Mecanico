import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ControlVenta,
  ControlVentasService,
  ControlVentaFormulario
} from '../../services/controlVentas.service';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-control-ventas',
  standalone:true,
  styleUrl: './control-ventas.css',
  templateUrl: './control-ventas.html',
})
export class ControlVentas implements OnInit{
  private controlVentaService = inject(ControlVentasService);
  private cdr = inject(ChangeDetectorRef);

  controlVentas: ControlVenta[] = [];
    controlVentasFiltrados: ControlVenta[] = [];
  
    cargando = false;
    guardando = false;
    formularioVisible = false;
  
    error = '';
    mensaje = '';
  
    controlVentaEditandoId: number | null = null;
  
    formulario: ControlVentaFormulario = this.crearFormularioVacio();
  
    ngOnInit(): void {
      this.cargarControlVentas();
    }
  
    cargarControlVentas(): void {
      this.cargando = true;
      this.error = '';
  
      this.controlVentaService.obtenerControlVentas().subscribe({
        next: (respuesta) => {
          this.controlVentas = respuesta;
          this.controlVentasFiltrados = respuesta;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar Control Ventas:', error);
          this.error = 'No fue posible cargar los Control Ventas.';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  
    buscar(event: Event): void {
      const input = event.target as HTMLInputElement;
      const texto = input.value.trim().toLowerCase();
  
      if (!texto) {
        this.controlVentasFiltrados = this.controlVentas;
        return;
      }
  
      this.controlVentasFiltrados = this.controlVentas.filter((controlVenta) =>
        controlVenta.idservicio.toString().includes(texto) ||
        controlVenta.idcliente.toString().includes(texto) ||
        controlVenta.fecha.toLowerCase().includes(texto) ||
        controlVenta.subtotal.toString().includes(texto) ||
        controlVenta.impuesto.toString().includes(texto) ||
        controlVenta.total.toString().includes(texto) ||
        controlVenta.forma_pago.toLowerCase().includes(texto) ||
        controlVenta.estadoventa.toLowerCase().includes(texto)
      );
    }
  
    nuevoControlVenta(): void {
      this.controlVentaEditandoId = null;
      this.formulario = this.crearFormularioVacio();
      this.formularioVisible = true;
      this.guardando = false;
      this.error = '';
      this.mensaje = '';
    }
  
    editarControlVenta(controlVenta: ControlVenta): void {
      this.controlVentaEditandoId = controlVenta.idventas;
  
      this.formulario = {
        idServicio: controlVenta.idservicio,
        idCliente: controlVenta.idcliente,
        fecha: controlVenta.fecha,
        subtotal: controlVenta.subtotal,
        impuesto: controlVenta.impuesto,
        total: controlVenta.total,
        forma_pago: controlVenta.forma_pago,
        estadoVenta: controlVenta.estadoventa
      };
  
      this.formularioVisible = true;
      this.guardando = false;
      this.error = '';
      this.mensaje = '';
    }
  
    guardarControlVenta(): void {
      if (!this.formularioValido()) {
        this.error = 'Por favor completa todos los campos requeridos.';
        return;
      }
  
      this.guardando = true;
      this.error = '';
      this.mensaje = '';
  
      if (this.controlVentaEditandoId === null) {
        this.crearControlVenta();
      } else {
        this.actualizarControlVenta();
      }
    }
  
    crearControlVenta(): void {
      this.controlVentaService.crearControl(this.formulario).subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'control venta creado exitosamente.';
          this.formularioVisible = false;
          this.controlVentaEditandoId = null;
          this.formulario = this.crearFormularioVacio();
          this.cargarControlVentas();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al crear control venta:', error);
          this.error = 'No fue posible crear el control venta.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
    }
  
    actualizarControlVenta(): void {
      if (this.controlVentaEditandoId === null) return;
  
      this.controlVentaService
        .actualizarControl(this.controlVentaEditandoId, this.formulario)
        .subscribe({
          next: () => {
            this.guardando = false;
            this.mensaje = 'control venta actualizado exitosamente.';
            this.formularioVisible = false;
            this.controlVentaEditandoId = null;
            this.formulario = this.crearFormularioVacio();
            this.cargarControlVentas();
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error al actualizar control ventas:', error);
            this.error = 'No fue posible actualizar el control venta.';
            this.guardando = false;
            this.cdr.detectChanges();
          }
        });
    }
  
    eliminarControlVenta(controlVenta: ControlVenta): void {
      const confirmar = window.confirm(
        `¿Deseas eliminar el control venta "${controlVenta.idventas}"?`
      );
  
      if (!confirmar) return;
  
      this.error = '';
      this.mensaje = '';
  
      this.controlVentaService.eliminarControl(controlVenta.idventas).subscribe({
        next: () => {
          this.mensaje = 'Control venta eliminado exitosamente.';
          this.cargarControlVentas();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al eliminar control ventas:', error);
          this.error = 'No fue posible eliminar el control venta.';
          this.cdr.detectChanges();
        }
      });
    }
  
    cancelarFormulario(): void {
      this.formularioVisible = false;
      this.controlVentaEditandoId = null;
      this.guardando = false;
      this.formulario = this.crearFormularioVacio();
      this.error = '';
    }
  
    formularioValido(): boolean {
      return (
        this.formulario.idServicio > 0 &&
        this.formulario.idCliente > 0 &&
        this.formulario.fecha.trim() !== '' &&
        this.formulario.subtotal >= 0 &&
        this.formulario.impuesto >= 0 &&
        this.formulario.total >= 0 &&
        this.formulario.forma_pago.trim() !== '' &&
        this.formulario.estadoVenta.trim() !== ''
      );
    }
  
    crearFormularioVacio(): ControlVentaFormulario {
      return {
        idServicio: 0,
        idCliente: 0,
        fecha: '',
        subtotal: 0,
        impuesto: 0,
        total: 0,
        forma_pago: 'Efectivo',
        estadoVenta: 'Pendiente'
      };
    }
}
