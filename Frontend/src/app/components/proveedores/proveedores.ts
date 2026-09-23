import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Proveedor,
  ProveedorService,
  ProveedorFormulario
} from '../../services/proveedores.service';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-proveedores',
  standalone: true,
  styleUrl: './proveedores.css',
  templateUrl: './proveedores.html',
})
export class Proveedores implements OnInit{
  private proveedorService = inject(ProveedorService);
  private cdr = inject(ChangeDetectorRef);

  proveedores: Proveedor[] = [];
    proveedoresFiltrados: Proveedor[] = [];
  
    cargando = false;
    guardando = false;
    formularioVisible = false;
  
    error = '';
    mensaje = '';
  
    proveedorEditandoId: number | null = null;
  
    formulario: ProveedorFormulario = this.crearFormularioVacio();
  
    ngOnInit(): void {
      this.cargarProveedores();
    }
  
    cargarProveedores(): void {
      this.cargando = true;
      this.error = '';
  
      this.proveedorService.obtenerProveedores().subscribe({
        next: (respuesta) => {
          this.proveedores = respuesta;
          this.proveedoresFiltrados = respuesta;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar Proveedores:', error);
          this.error = 'No fue posible cargar los Proveedores.';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  
    buscar(event: Event): void {
      const input = event.target as HTMLInputElement;
      const texto = input.value.trim().toLowerCase();
  
      if (!texto) {
        this.proveedoresFiltrados = this.proveedores;
        return;
      }
  
      this.proveedoresFiltrados = this.proveedores.filter((proveedor) =>
        proveedor.nombreproveedor.toLowerCase().includes(texto) ||
        proveedor.ruc.toLowerCase().includes(texto) ||
        proveedor.telefonoproveedor.toLowerCase().includes(texto)
      );
    }
  
    nuevoProveedor(): void {
      this.proveedorEditandoId = null;
      this.formulario = this.crearFormularioVacio();
      this.formularioVisible = true;
      this.guardando = false;
      this.error = '';
      this.mensaje = '';
    }
  
    editarProveedor(proveedor: Proveedor): void {
      this.proveedorEditandoId = proveedor.idproveedor;
  
      this.formulario = {
        nombreProveedor: proveedor.nombreproveedor,
        RUC: proveedor.ruc,
        telefonoProveedor: proveedor.telefonoproveedor,
      };
  
      this.formularioVisible = true;
      this.guardando = false;
      this.error = '';
      this.mensaje = '';
    }
  
    guardarProveedor(): void {
      if (!this.formularioValido()) {
        this.error = 'Por favor completa todos los campos requeridos.';
        return;
      }
  
      this.guardando = true;
      this.error = '';
      this.mensaje = '';
  
      if (this.proveedorEditandoId === null) {
        this.crearProveedor();
      } else {
        this.actualizarProveedor();
      }
    }
  
    crearProveedor(): void {
      this.proveedorService.crearProveedor(this.formulario).subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'proveedor creado exitosamente.';
          this.formularioVisible = false;
          this.proveedorEditandoId = null;
          this.formulario = this.crearFormularioVacio();
          this.cargarProveedores();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al crear proveedor:', error);
          this.error = 'No fue posible crear el proveedor.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
    }
  
    actualizarProveedor(): void {
      if (this.proveedorEditandoId === null) return;
  
      this.proveedorService
        .actualizarProveedor(this.proveedorEditandoId, this.formulario)
        .subscribe({
          next: () => {
            this.guardando = false;
            this.mensaje = 'proveedor actualizado exitosamente.';
            this.formularioVisible = false;
            this.proveedorEditandoId = null;
            this.formulario = this.crearFormularioVacio();
            this.cargarProveedores();
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error al actualizar proveedores:', error);
            this.error = 'No fue posible actualizar el proveedor.';
            this.guardando = false;
            this.cdr.detectChanges();
          }
        });
    }
  
    eliminarProveedor(proveedor: Proveedor): void {
      const confirmar = window.confirm(
        `¿Deseas eliminar al proveedor "${proveedor.nombreproveedor}"?`
      );
  
      if (!confirmar) return;
  
      this.error = '';
      this.mensaje = '';
  
      this.proveedorService.eliminarProveedor(proveedor.idproveedor).subscribe({
        next: () => {
          this.mensaje = 'Proveedor eliminado exitosamente.';
          this.cargarProveedores();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al eliminar proveedores:', error);
          this.error = 'No fue posible eliminar el Proveedor.';
          this.cdr.detectChanges();
        }
      });
    }
  
    cancelarFormulario(): void {
      this.formularioVisible = false;
      this.proveedorEditandoId = null;
      this.guardando = false;
      this.formulario = this.crearFormularioVacio();
      this.error = '';
    }
  
    formularioValido(): boolean {
      return (
        this.formulario.nombreProveedor.trim() !== '' &&
        this.formulario.RUC.trim() !== '' &&
        this.formulario.telefonoProveedor.trim() !== '' 
      );
    }
  
    crearFormularioVacio(): ProveedorFormulario {
      return {
        nombreProveedor: '',
        RUC: '',
        telefonoProveedor: '',
      };
    }
}
