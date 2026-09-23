import pool from '../connection/conexion';

import {
    Estadisticas
} from '../Models/estadisticasModel';

import {
    obtenerActividadesRecientes
} from './actividadService';

export interface ActividadReciente {
    tipo: string;
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    estado: string | null;
}

export async function obtenerEstadisticas() {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM obtener_estadisticas()'
        );

        return rows[0];

    } catch (error) {
        throw new Error(
            'Error al obtener las estadísticas: ' +
            error
        );
    }
}

export async function obtenerActividadReciente():
Promise<ActividadReciente[]> {
    try {
        const actividades =await obtenerActividadesRecientes(15);

        return actividades.map((actividad) => {
            return {tipo:actividad.tipo,
                id:actividad.idActividad,
                titulo:actividad.titulo,
                descripcion:actividad.descripcion,
                fecha:actividad.fecha,
                estado:actividad.estado || actividad.accion
            };
        });

    } catch (error) {
        throw new Error( 'Error al obtener la actividad reciente: ' + error
        );
    }
}

export const estadisticasService = {

    async obtener(): Promise<Estadisticas> {
        const respuesta =await obtenerEstadisticas();

        return {total_clientes: Number(respuesta.total_clientes),
            total_proveedores: Number(respuesta.total_proveedores),
            total_empleados: Number(respuesta.total_empleados),
            total_vehiculos: Number(respuesta.total_vehiculos),
            total_usuarios:Number(respuesta.total_usuarios),
            total_inventario: Number(respuesta.total_inventario),
            total_citas: Number(respuesta.total_citas),
            total_servicios:Number(respuesta.total_servicios),
            total_detalle:Number(respuesta.total_detalle),
            total_movimientos:Number(respuesta.total_movimientos),
            total_control:Number(respuesta.total_control)
        };
    },

    async obtenerActividad():
    Promise<ActividadReciente[]> {
        return obtenerActividadReciente();
    }
};