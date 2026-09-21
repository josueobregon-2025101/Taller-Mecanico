import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {Servicio,ServicioFormulario,ServicioService
} from '../../services/servicio.service';

@Component({selector: 'app-servicios',standalone: true,
  imports: [CommonModule,FormsModule
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class ServiciosComponent implements OnInit {

  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];

  cargando: boolean = false;
  guardando: boolean = false;
  formularioVisible: boolean = false;

  error: string = '';
  mensaje: string = '';
  textoBusqueda: string = '';

  servicioEditandoId: number | null = null;

  estadosServicio: string[] = [
    'Aprobado','En reparación','Entregado','Terminado'
  ];

  formulario: ServicioFormulario =this.crearFormularioVacio();

  constructor(private servicioService: ServicioService,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.cargarServicios();
  }

  cargarServicios(): void {this.cargando = true;this.error = '';

    this.servicioService.obtenerServicios().subscribe({
        next: (respuesta) => {this.servicios = respuesta;
         this.serviciosFiltrados = respuesta;
          this.cargando = false;

          this.cdr.detectChanges();
        },
        error: (error) => {console.error(
            'Error al cargar los servicios:', error);

          this.error ='No fue posible cargar los servicios.';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  buscar(event: Event): void {
    const input =event.target as HTMLInputElement;

    this.textoBusqueda = input.value.trim().toLowerCase();

    if (!this.textoBusqueda) {this.serviciosFiltrados =this.servicios;
      return;
    }

    this.serviciosFiltrados = this.servicios.filter((servicio) => {
        return (servicio.diagnostico.toLowerCase().includes(this.textoBusqueda) ||

          servicio.estadoServicio .toLowerCase() .includes(this.textoBusqueda) ||
          servicio.kilometraje_ing .toLowerCase() .includes(this.textoBusqueda) ||
          servicio.idServicios .toString() .includes(this.textoBusqueda) ||
          servicio.idVehiculos .toString() .includes(this.textoBusqueda) ||
          servicio.idCliente.toString().includes(this.textoBusqueda) );
      });
  }

  nuevoServicio(): void {
    this.servicioEditandoId = null;
    this.formulario = this.crearFormularioVacio();

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  editarServicio(servicio: Servicio
  ): void {this.servicioEditandoId = servicio.idServicios;

    this.formulario = { idVehiculos: servicio.idVehiculos,idCliente: servicio.idCliente,
    idEmpleado: servicio.idEmpleado,idCita: servicio.idCita,

      fecha_ingreso:
        this.formatearFecha(servicio.fecha_ingreso),

      fecha_entrega:
        servicio.fecha_entrega
          ? this.formatearFecha(servicio.fecha_entrega)
          : null,

      diagnostico: servicio.diagnostico,
      estadoServicio: servicio.estadoServicio,
      kilometraje_ing: servicio.kilometraje_ing
    };

    this.formularioVisible = true;
    this.guardando = false;
    this.error = '';
    this.mensaje = '';
  }

  guardarServicio(): void {
    if (!this.formularioValido()) {
      this.error =
        'Por favor completa todos los campos requeridos.';

      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.servicioEditandoId === null) {
      this.crearServicio();
    } else {
      this.actualizarServicio();
    }
  }

  crearServicio(): void {
    const datos =
      this.prepararFormulario();

    this.servicioService
      .crearServicio(datos)
      .subscribe({
        next: () => {
          this.guardando = false;

          this.mensaje =
            'Servicio creado exitosamente.';

          this.formularioVisible = false;
          this.servicioEditandoId = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarServicios();

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            'Error al crear el servicio:',
            error
          );

          this.error =
            'No fue posible crear el servicio.';

          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
  }

  actualizarServicio(): void {
    if (this.servicioEditandoId === null) {
      return;
    }

    const datos =
      this.prepararFormulario();

    this.servicioService
      .actualizarServicio(
        this.servicioEditandoId,
        datos
      )
      .subscribe({
        next: () => {
          this.guardando = false;

          this.mensaje =
            'Servicio actualizado exitosamente.';

          this.formularioVisible = false;
          this.servicioEditandoId = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarServicios();

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            'Error al actualizar el servicio:',
            error
          );

          this.error =
            'No fue posible actualizar el servicio.';

          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
  }

  eliminarServicio(
    servicio: Servicio
  ): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar el servicio #${servicio.idServicios}?`
    );

    if (!confirmar) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.servicioService
      .eliminarServicio(servicio.idServicios)
      .subscribe({
        next: () => {
          this.mensaje =
            'Servicio eliminado exitosamente.';

          this.cargarServicios();

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            'Error al eliminar el servicio:',
            error
          );

          this.error =
            'No fue posible eliminar el servicio.';

          this.cdr.detectChanges();
        }
      });
  }

  cancelarFormulario(): void {
    this.formularioVisible = false;
    this.servicioEditandoId = null;
    this.guardando = false;

    this.formulario =
      this.crearFormularioVacio();

    this.error = '';
  }

  formularioValido(): boolean {
    return (
      this.formulario.idVehiculos > 0 &&
      this.formulario.idCliente > 0 &&
      this.formulario.idEmpleado > 0 &&
      this.formulario.fecha_ingreso.trim() !== '' &&
      this.formulario.diagnostico.trim() !== '' &&
      this.formulario.estadoServicio.trim() !== '' &&
      this.formulario.kilometraje_ing.trim() !== ''
    );
  }

  crearFormularioVacio():
    ServicioFormulario {
    return {
      idVehiculos: 0,
      idCliente: 0,
      idEmpleado: 0,
      idCita: null,
      fecha_ingreso: '',
      fecha_entrega: null,
      diagnostico: '',
      estadoServicio: 'Aprobado',
      kilometraje_ing: ''
    };
  }

  prepararFormulario():
    ServicioFormulario {
    return {
      idVehiculos:
        Number(this.formulario.idVehiculos),

      idCliente:
        Number(this.formulario.idCliente),

      idEmpleado:
        Number(this.formulario.idEmpleado),

      idCita:
        this.formulario.idCita
          ? Number(this.formulario.idCita)
          : null,

      fecha_ingreso:
        this.formulario.fecha_ingreso,

      fecha_entrega:
        this.formulario.fecha_entrega
          ? this.formulario.fecha_entrega
          : null,

      diagnostico:
        this.formulario.diagnostico.trim(),

      estadoServicio:
        this.formulario.estadoServicio,

      kilometraje_ing:
        this.formulario.kilometraje_ing.trim()
    };
  }

  formatearFecha(fecha: string): string {
    return fecha.substring(0, 10);
  }
}