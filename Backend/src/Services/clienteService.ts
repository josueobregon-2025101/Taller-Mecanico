import pool from '../connection/conexion';
import { Cliente } from '../Models/Cliente';

export const getAllClientes = async (): Promise<Cliente[]> => {
    try {
        const result = await pool.query('SELECT * FROM Clientes');
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener clientes: ' + error);
    }
};

export const getClienteById = async (id: number): Promise<Cliente | null> => {
    try {
        const result = await pool.query(
            'SELECT * FROM Clientes WHERE "idClientes" = $1',
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al obtener cliente: ' + error);
    }
};

export const createCliente = async (
    cliente: Omit<Cliente, 'idClientes'>
): Promise<Cliente> => {
    const { nombreCliente, apellido, documento, telefono } = cliente;

    try {
        const result = await pool.query(
            `INSERT INTO Clientes (nombreCliente, apellido, documento, telefono)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nombreCliente, apellido, documento, telefono]
        );

        return result.rows[0];
    } catch (error) {
        throw new Error('Error al crear cliente: ' + error);
    }
};

export const updateCliente = async (
    id: number,
    cliente: Partial<Cliente>
): Promise<Cliente | null> => {
    const fields = Object.keys(cliente)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');

    const values = Object.values(cliente);

    if (fields.length === 0) {
        throw new Error('No hay campos para actualizar');
    }

    try {
        const result = await pool.query(
            `UPDATE Clientes
             SET ${fields}
             WHERE "idClientes" = $${values.length + 1}
             RETURNING *`,
            [...values, id]
        );

        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al actualizar cliente: ' + error);
    }
};

export const deleteCliente = async (id: number): Promise<boolean> => {
    try {
        const result = await pool.query(
            'DELETE FROM Clientes WHERE "idClientes" = $1 RETURNING *',
            [id]
        );

        return result.rowCount ? true : false;
    } catch (error) {
        throw new Error('Error al eliminar cliente: ' + error);
    }
};