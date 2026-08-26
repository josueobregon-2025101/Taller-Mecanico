import pool from '../connection/conexion';
import { Empleado } from '../Models/Empleado';

export const getAllEmpleados = async (): Promise<Empleado[]> => {
    try {
        const result = await pool.query('SELECT * FROM Empleados');
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener empleados: ' + error);
    }
};

export const getEmpleadoById = async (id: number): Promise<Empleado | null> => {
    try {
        const result = await pool.query('SELECT * FROM Empleados WHERE "idEmpleado" = $1', [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al obtener empleado: ' + error);
    }
};

export const createEmpleado = async (empleado: Omit<Empleado, 'idEmpleado'>): Promise<Empleado> => {
    const { nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado } = empleado;
    try {
        const result = await pool.query(
            `INSERT INTO Empleados (nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al crear empleado: ' + error);
    }
};

export const updateEmpleado = async (id: number, empleado: Partial<Empleado>): Promise<Empleado | null> => {
    const fields = Object.keys(empleado).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = Object.values(empleado);
    if (fields.length === 0) throw new Error('No hay campos para actualizar');
    try {
        const result = await pool.query(
            `UPDATE Empleados SET ${fields} WHERE "idEmpleado" = $${values.length + 1} RETURNING *`,
            [...values, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al actualizar empleado: ' + error);
    }
};

export const deleteEmpleado = async (id: number): Promise<boolean> => {
    try {
        const result = await pool.query('DELETE FROM Empleados WHERE "idEmpleado" = $1 RETURNING *', [id]);
        return result.rowCount ? true : false;
    } catch (error) {
        throw new Error('Error al eliminar empleado: ' + error);
    }
};