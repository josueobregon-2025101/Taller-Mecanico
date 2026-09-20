import pool from "../connection/conexion";
import { Estadisticas } from "../Models/estadisticasModel";

export async function obtenerEstadisticas(){
    try {
        const { rows }  = await pool.query('SELECT * FROM obtener_estadisticas()')
        return rows[0];
        
    } catch (error) {
        throw new Error('Error al obtener las estadisticas: ' + error);
    }
}

export const estadisticasService ={
    async obtener():Promise<Estadisticas>{
        const r = await obtenerEstadisticas();
        return {
            total_clientes: Number(r.total_clientes),
            total_proveedores: Number(r.total_proveedores),
            total_empleados: Number(r.total_empleados),
            total_vehiculos: Number(r.total_vehiculos),
            total_usuarios: Number(r.total_usuarios),
            total_inventario: Number(r.total_inventario),
            total_citas: Number(r.total_citas),
            total_servicios: Number(r.total_servicios),
            total_detalle: Number(r.total_detalle),
            total_movimientos: Number(r.total_movimientos),
            total_control: Number(r.total_control),
        };
    },
};