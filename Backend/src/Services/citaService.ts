import pool from '../connection/conexion';
import { Cita } from '../Models/Cita';

export const getAllCitas = async (): Promise<Cita[]> => {
    try {
        const result = await pool.query('SELECT * FROM Citas');
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener citas: ' + error);
    }
};

export const getCitaById = async (id: number): Promise<Cita | null> => {
    try {
        const result = await pool.query('SELECT * FROM Citas WHERE "idCita" = $1', [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al obtener cita: ' + error);
    }
};

export const createCita = async (cita: Omit<Cita, 'idCita'>): Promise<Cita> => {
    const { idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita } = cita;
    try {
        const result = await pool.query(
            `INSERT INTO Citas (idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al crear cita: ' + error);
    }
};

export const updateCita = async (id: number, cita: Partial<Cita>): Promise<Cita | null> => {
    const fields = Object.keys(cita).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = Object.values(cita);
    if (fields.length === 0) throw new Error('No hay campos para actualizar');
    try {
        const result = await pool.query(
            `UPDATE Citas SET ${fields} WHERE "idCita" = $${values.length + 1} RETURNING *`,
            [...values, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al actualizar cita: ' + error);
    }
};

export const deleteCita = async (id: number): Promise<boolean> => {
    try {
        const result = await pool.query('DELETE FROM Citas WHERE "idCita" = $1 RETURNING *', [id]);
        return result.rowCount ? true : false;
    } catch (error) {
        throw new Error('Error al eliminar cita: ' + error);
    }
};