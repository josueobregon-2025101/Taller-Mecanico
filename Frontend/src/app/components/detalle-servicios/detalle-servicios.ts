import { CommonModule } from '@angular/common';

import {ChangeDetectorRef,Component,OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {DetalleServicio,DetalleServicioFormulario,DetalleServicioService
} from '../../services/detalle-servicio.service';

@Component({selector: 'app-detalle-servicios',standalone: true,
  imports: [CommonModule,FormsModule
  ],templateUrl: './detalle-servicios.html',
  styleUrl: './detalle-servicios.css'
})
export class DetalleServiciosComponent implements OnInit {

  detalles: DetalleServicio[] = [];
  detallesFiltrados: DetalleServicio[] = [];

  cargando: boolean = false;
  guardando: boolean = false;
  formularioVisible: boolean = false;

  error: string = '';
  mensaje: string = '';
  textoBusqueda: string = '';

  detalleEditandoId: number | null = null;

  formulario: DetalleServicioFormulario =this.crearFormularioVacio();

  constructor( private detalleServicioService: DetalleServicioService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {this.cargarDetalles();
  }

  cargarDetalles(): void {this.cargando = true;this.error = '';

    this.detalleServicioService.obtenerDetalles().subscribe({
        next: (respuesta) => {this.detalles = respuesta;
          this.detallesFiltrados = respuesta;
          this.cargando = false;

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar los detalles de servicio:', error);

          this.error = 'No fue posible cargar los detalles de servicio.';

          this.cargando = false;

          this.cdr.detectChanges();
        }
      });
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.textoBusqueda = input.value .trim().toLowerCase();

    if (!this.textoBusqueda) {this.detallesFiltrados = this.detalles;
      return;
    }

    this.detallesFiltrados = this.detalles.filter((detalle) => {
        return (detalle.descripcionDetalle.toLowerCase() .includes(this.textoBusqueda) ||

          detalle.idDetalle.toString().includes(this.textoBusqueda) ||

          detalle.idServicio.toString().includes(this.textoBusqueda) ||

          detalle.idInventario ?.toString().includes(this.textoBusqueda) ||
          false
        );
      });
  }

  nuevoDetalle(): void { this.detalleEditandoId = null;

    this.formulario = this.crearFormularioVacio();
    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  editarDetalle(
    detalle: DetalleServicio
  ): void {
 this.detalleEditandoId = detalle.idDetalle;

    this.formulario = {idServicio: detalle.idServicio,
      descripcionDetalle:
     detalle.descripcionDetalle,
      cantidadHoras:
        Number(detalle.cantidadHoras),
      idInventario:
        detalle.idInventario,
      cantidad_repuesto:
        detalle.cantidad_repuesto,
      precio_unitario:
        Number(detalle.precio_unitario)
    };

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  guardarDetalle(): void {
    if (!this.formularioValido()) {this.error ='Por favor completa todos los campos requeridos.';
    return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.detalleEditandoId === null) {  this.crearDetalle();
    } else { this.actualizarDetalle();
    }
  }

  crearDetalle(): void { const datos = this.prepararFormulario();

    this.detalleServicioService.crearDetalle(datos).subscribe({
        next: () => {  this.guardando = false;
          this.mensaje =
            'Detalle de servicio creado exitosamente.';

          this.formularioVisible = false;
          this.detalleEditandoId = null;
          this.formulario =
        this.crearFormularioVacio();

          this.cargarDetalles();

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al crear el detalle de servicio:',  error
          );

          this.error = 'No fue posible crear el detalle de servicio.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
  }

  actualizarDetalle(): void {if (this.detalleEditandoId === null) {
      return;
    }

    const datos = this.prepararFormulario();

    this.detalleServicioService.actualizarDetalle(  this.detalleEditandoId, datos
      ) .subscribe({ next: () => { this.guardando = false;

          this.mensaje =   'Detalle de servicio actualizado exitosamente.';

          this.formularioVisible = false;
          this.detalleEditandoId = null;

          this.formulario = this.crearFormularioVacio();

          this.cargarDetalles();

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(  'Error al actualizar el detalle de servicio:', error
          );
          this.error = 'No fue posible actualizar el detalle de servicio.';

          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
  }

  eliminarDetalle(
    detalle: DetalleServicio
  ): void {
 const confirmar = window.confirm(`¿Deseas eliminar el detalle #${detalle.idDetalle}?`
    );

    if (!confirmar) {   return;
 }

    this.error = '';
    this.mensaje = '';

    this.detalleServicioService .eliminarDetalle(detalle.idDetalle) .subscribe({
      next: () => {    this.mensaje =
            'Detalle de servicio eliminado exitosamente.';

          this.cargarDetalles();

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            'Error al eliminar el detalle de servicio:',
            error
          );

          this.error =
            'No fue posible eliminar el detalle de servicio.';

          this.cdr.detectChanges();
        }
      });
  }

  cancelarFormulario(): void {   this.formularioVisible = false; this.detalleEditandoId = null;this.guardando = false;

    this.formulario = this.crearFormularioVacio();
    this.error = '';
  }

  formularioValido(): boolean {
    return (  this.formulario.idServicio > 0 &&  this.formulario.descripcionDetalle.trim() !== '' &&
      this.formulario.cantidadHoras >= 0 &&
      this.formulario.precio_unitario > 0
    );
  }

  crearFormularioVacio():
    DetalleServicioFormulario {
    return {
      idServicio: 0,
      descripcionDetalle: '',
      cantidadHoras: 0,
      idInventario: null,
      cantidad_repuesto: null,
      precio_unitario: 0
    };
  }

  prepararFormulario():
    DetalleServicioFormulario {
    return {idServicio:
        Number(this.formulario.idServicio),

      descripcionDetalle:  this.formulario.descripcionDetalle.trim(),

      cantidadHoras: Number(this.formulario.cantidadHoras),

      idInventario: this.formulario.idInventario
          ? Number(this.formulario.idInventario)
          : null,

      cantidad_repuesto:  this.formulario.cantidad_repuesto
          ? Number(this.formulario.cantidad_repuesto)
          : null,

      precio_unitario: Number(this.formulario.precio_unitario)
    };
  }
}