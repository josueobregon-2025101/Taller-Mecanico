import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

/*
  Estructura utilizada por el componente
  para mostrar los detalles de servicio.
*/
export interface DetalleServicio {
  idDetalle: number;
  idServicio: number;
  descripcionDetalle: string;
  cantidadHoras: number;
  idInventario: number | null;
  cantidad_repuesto: number | null;
  precio_unitario: number;
}


interface DetalleServicioBackend {
  iddetalle: number;
  idservicio: number;
  descripciondetalle: string;
  cantidadhoras: number;
  idinventario: number | null;
  cantidad_repuesto: number | null;
  precio_unitario: number;
}

/*
  Datos que Angular enviará al backend
  al crear o actualizar un detalle.
*/
export interface DetalleServicioFormulario {
  idServicio: number;
  descripcionDetalle: string;
  cantidadHoras: number;
  idInventario: number | null;
  cantidad_repuesto: number | null;
  precio_unitario: number;
}

/*
  Respuesta del backend al crear un detalle.
*/
export interface CrearDetalleServicioResponse {
  status: string;
  message: string;
  data: DetalleServicioBackend;
}

/*
  Respuesta del backend al actualizar un detalle.
*/
export interface ActualizarDetalleServicioResponse {
  status: string;
  message: string;
  result: DetalleServicioBackend | null;
}

/*
  Respuesta del backend al eliminar un detalle.
*/
export interface EliminarDetalleServicioResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DetalleServicioService {

  private apiUrl ='http://localhost:3000/api/detalle-servicios';

  constructor(
    private http: HttpClient
  ) {}

  obtenerDetalles(): Observable<DetalleServicio[]> {return this.http.get<DetalleServicioBackend[]>(this.apiUrl).pipe(
        map((respuesta) => {return respuesta.map((detalle) => {return this.convertirDetalle(detalle);});
        })
      );
  }

  obtenerDetalle(id: number): Observable<DetalleServicio> {return this.http.get<DetalleServicioBackend>(
        `${this.apiUrl}/${id}`).pipe(
        map((detalle) => { return this.convertirDetalle(detalle);
        })
      );
  }

  crearDetalle( detalle: DetalleServicioFormulario
  ): Observable<CrearDetalleServicioResponse> {return this.http.post<CrearDetalleServicioResponse>(this.apiUrl,detalle);
  }

  actualizarDetalle(  id: number, detalle: DetalleServicioFormulario
  ): Observable<ActualizarDetalleServicioResponse> {return this.http.put<ActualizarDetalleServicioResponse>(
      `${this.apiUrl}/${id}`, detalle
    );
  }

  eliminarDetalle( id: number
  ): Observable<EliminarDetalleServicioResponse> { return this.http.delete<EliminarDetalleServicioResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  /*
    Convierte los nombres devueltos por PostgreSQL
    en nombres más cómodos para el componente.
  */
  private convertirDetalle(detalle: DetalleServicioBackend
  ): DetalleServicio {
    return { idDetalle: detalle.iddetalle, idServicio: detalle.idservicio, descripcionDetalle:
     detalle.descripciondetalle,cantidadHoras: Number(detalle.cantidadhoras),
    idInventario: detalle.idinventario,cantidad_repuesto: detalle.cantidad_repuesto, precio_unitario: Number(detalle.precio_unitario)
    };
  }
}