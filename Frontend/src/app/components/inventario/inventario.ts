import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {Inventario,InventarioFormulario,InventarioService
} from '../../services/inventario.service';

@Component({ selector: 'app-inventario',standalone: true,
  imports: [CommonModule,FormsModule],templateUrl: './inventario.html', styleUrl: './inventario.css'
})
export class InventarioComponent implements OnInit {

  inventario: Inventario[] = [];
  inventarioFiltrado: Inventario[] = [];

  cargando: boolean = false;
  guardando: boolean = false;
  formularioVisible: boolean = false;

  error: string = '';
  mensaje: string = '';
  textoBusqueda: string = '';

  productoEditandoId: number | null = null;

  formulario: InventarioFormulario = this.crearFormularioVacio();

  constructor(
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void { this.cargarInventario();
  }

  cargarInventario(): void {this.cargando = true;
    this.error = '';

    this.inventarioService.obtenerInventario().subscribe({
    next: (respuesta) => {this.inventario = respuesta;this.inventarioFiltrado = respuesta;this.cargando = false;},
      error: (error) => { console.error('Error al cargar el inventario:', error);
        this.error = 'No fue posible cargar el inventario.';
        this.cargando = false;
      }
    });
  }

  buscar(event: Event): void { const input = event.target as HTMLInputElement;

    this.textoBusqueda = input.value .trim().toLowerCase();

    if (!this.textoBusqueda) { this.inventarioFiltrado = this.inventario;
      return;
    }

    this.inventarioFiltrado = this.inventario.filter((producto) => {
      return ( producto.nombre.toLowerCase().includes(this.textoBusqueda) ||
        producto.descripcion.toLowerCase().includes(this.textoBusqueda) ||
        producto.marca.toLowerCase().includes(this.textoBusqueda) ||
        producto.categoria.toLowerCase().includes(this.textoBusqueda)
      );
    });
  }

  nuevoProducto(): void {this.productoEditandoId = null; this.formulario = this.crearFormularioVacio();
    this.formularioVisible = true;
    this.error = '';
    this.mensaje = '';
  }

  editarProducto(producto: Inventario): void {
    this.productoEditandoId = producto.idinventario;

    this.formulario = {nombre: producto.nombre,descripcion: producto.descripcion,marca: producto.marca,
      categoria: producto.categoria,stock_actual: Number(producto.stock_actual),precio_compra: Number(producto.precio_compra),
      precio_venta: Number(producto.precio_venta),idProveedor: producto.idproveedor
    };

    this.formularioVisible = true;
    this.error = '';
    this.mensaje = '';
  }

  guardarProducto(): void {
    if (!this.formularioValido()) { this.error = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    if (this.productoEditandoId === null) { this.crearProducto();
    } else { this.actualizarProducto();
    }
  }

  crearProducto(): void { this.inventarioService.crearProducto(this.formulario).subscribe({
      next: () => {this.mensaje = 'Producto creado exitosamente.';
        this.guardando = false;
        this.formularioVisible = false;
        this.formulario = this.crearFormularioVacio();
        this.cargarInventario();
      },
      error: (error) => { console.error('Error al crear el producto:', error);
        this.error = 'No fue posible crear el producto.';
        this.guardando = false;
      }
    });
  }

  actualizarProducto(): void {
    if (this.productoEditandoId === null) {
      return;
    }

    this.inventarioService.actualizarProducto(this.productoEditandoId,this.formulario
    ).subscribe({next: () => { this.mensaje = 'Producto actualizado exitosamente.';
        this.guardando = false;
        this.formularioVisible = false;
        this.productoEditandoId = null;
        this.formulario = this.crearFormularioVacio();
        this.cargarInventario();
      },
      error: (error) => {console.error('Error al actualizar el producto:', error);
        this.error = 'No fue posible actualizar el producto.';
        this.guardando = false;
      }
    });
  }

  eliminarProducto(producto: Inventario): void { const confirmar = window.confirm(
      `¿Deseas eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) { return;
    }
    this.error = '';
    this.mensaje = '';

    this.inventarioService.eliminarProducto(producto.idinventario).subscribe({next: () => {
        this.mensaje = 'Producto eliminado exitosamente.';
        this.cargarInventario();
        },
        error: (error) => {console.error('Error al eliminar el producto:', error);
        this.error = 'No fue posible eliminar el producto.';
        }
      });
  }

  cancelarFormulario(): void {this.formularioVisible = false;
    this.productoEditandoId = null;
    this.formulario = this.crearFormularioVacio();
    this.error = '';
  }

  formularioValido(): boolean {
    return (this.formulario.nombre.trim() !== '' &&
      this.formulario.descripcion.trim() !== '' &&
      this.formulario.marca.trim() !== '' &&
      this.formulario.categoria.trim() !== '' &&
      this.formulario.stock_actual >= 0 &&
      this.formulario.precio_compra > 0 &&
      this.formulario.precio_venta > 0 &&
      this.formulario.idProveedor > 0
    );
  }

  crearFormularioVacio(): InventarioFormulario {
    return {
      nombre: '',
      descripcion: '',
      marca: '',
      categoria: '',
      stock_actual: 0,
      precio_compra: 0,
      precio_venta: 0,
      idProveedor: 0
    };
  }
}