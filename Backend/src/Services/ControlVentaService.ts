import pool from '../connection/conexion'
import { ControlVenta } from '../Models/ControlVenta'

export const getAllControlVentas = async():Promise<ControlVenta[]> =>{
    try {
        const respuesta  = await pool.query('SELECT * FROM Control_Ventas');
        return respuesta.rows as ControlVenta[];
    } catch (error) {
        throw new Error('Error al obtener los controles de ventas: '+ error)
    }
} 