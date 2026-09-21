import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

/*
  Estructura limpia que utilizará el componente
  para mostrar cada servicio.
*/
export interface Servicio {
  idServicios: number;
  idVehiculos: number;
  idCliente: number;
  idEmpleado: number;
  idCita: number | null;
  fecha_ingreso: string;
  fecha_entrega: string | null;
  diagnostico: string;
  estadoServicio: string;
  kilometraje_ing: string;
}

/*
  Estructura que PostgreSQL devuelve desde el backend.

*/
interface ServicioBackend {
  idservicios: number;
  idvehiculos: number;
  idcliente: number;
  idempleado: number;
  idcita: number | null;
  fecha_ingreso: string;
  fecha_entrega: string | null;
  diagnostico: string;
  estadoservicio: string;
  kilometraje_ing: string;
}

/*
  Información que se enviará al backend
  al crear o actuaizar un servicio.
*/
export interface ServicioFormulario {
  idVehiculos: number;
  idCliente: number;
  idEmpleado: number;
  idCita: number | null;
  fecha_ingreso: string;
  fecha_entrega: string | null;
  diagnostico: string;
  estadoServicio: string;
  kilometraje_ing: string;
}

/*
  Respuesta del backend al crear un servicio.
*/
export interface CrearServicioResponse {
  status: string;
  message: string;
  data: ServicioBackend;
}

/* Respuesta del backend al actualizar un servicio.*/
export interface ActualizarServicioResponse {
  status: string;
  message: string;
  result: ServicioBackend | null;
}
/*
  Repuesta del backend al eliminar un servicio.
*/
export interface EliminarServicioResponse {
  status: string;
  message: string;
  result: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl =
    'http://localhost:3000/api/servicios';

  constructor(
    private http: HttpClient
  ) {}

  obtenerServicios(): Observable<Servicio[]> {
    return this.http .get<ServicioBackend[]>(this.apiUrl).pipe(map((respuesta) => {
          return respuesta.map((servicio) => {return this.convertirServicio(servicio);
          });
        })
      );
  }

  obtenerServicio(id: number): Observable<Servicio> {return this.http.get<ServicioBackend>( `${this.apiUrl}/${id}`).pipe(
        map((servicio) => {return this.convertirServicio(servicio);
        })
      );
  }

  crearServicio(servicio: ServicioFormulario
  ): Observable<CrearServicioResponse> {return this.http.post<CrearServicioResponse>(
      this.apiUrl,servicio
    );
  }

  actualizarServicio(id: number,servicio: ServicioFormulario
  ): Observable<ActualizarServicioResponse> {return this.http.put<ActualizarServicioResponse>(
      `${this.apiUrl}/${id}`,servicio
    );
  }

  eliminarServicio(id: number
  ): Observable<EliminarServicioResponse> {return this.http.delete<EliminarServicioResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  /*
    Convierte los nombres enviados por PosgreSQL
    en nombres más comodos para el compoente.
  */
  private convertirServicio(
    servicio: ServicioBackend
  ): Servicio {
    return {idServicios: servicio.idservicios, idVehiculos: servicio.idvehiculos,idCliente: servicio.idcliente,
    idEmpleado: servicio.idempleado,idCita: servicio.idcita,fecha_ingreso: servicio.fecha_ingreso,
    fecha_entrega: servicio.fecha_entrega,diagnostico: servicio.diagnostico, 
    estadoServicio: servicio.estadoservicio, kilometraje_ing: servicio.kilometraje_ing
    };
  }
}