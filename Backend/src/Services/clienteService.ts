import pool from '../connection/conexion';
import { Cliente } from '../Models/Cliente';

// OBTENER TODOS LOS CLIENTES
export const getAllClientes = async (): Promise<Cliente[]> => {
    try {
        const result = await pool.query(`
            SELECT
                "idclientes" AS "idClientes",
                nombrecliente,
                apellido,
                documento,
                telefono
            FROM Clientes
            ORDER BY "idclientes" ASC
        `);

        return result.rows as Cliente[];

    } catch (error) {
        console.error('Error al obtener clientes:', error);
        throw new Error('Error al obtener clientes');
    }
};

// OBTENER CLIENTE POR ID
export const getClienteById = async (
    id: number
): Promise<Cliente | null> => {

    try {
        const result = await pool.query(`
            SELECT
                "idclientes" AS "idClientes",
                nombrecliente,
                apellido,
                documento,
                telefono
            FROM Clientes
            WHERE "idclientes" = $1
        `, [id]);

        return result.rows[0] || null;

    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        throw new Error('Error al obtener cliente por ID');
    }
};

// CREAR CLIENTE
export const createCliente = async (
    cliente: Omit<Cliente, 'idClientes'>
): Promise<Cliente> => {

    try {
        const result = await pool.query(`
            INSERT INTO Clientes (
                nombrecliente,
                apellido,
                documento,
                telefono
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                "idclientes" AS "idClientes",
                nombrecliente,
                apellido,
                documento,
                telefono
        `, [
            cliente.nombrecliente,
            cliente.apellido,
            cliente.documento,
            cliente.telefono
        ]);

        return result.rows[0] as Cliente;

    } catch (error) {
        console.error('Error al crear cliente:', error);
        throw new Error('Error al crear cliente');
    }
};

// ACTUALIZAR CLIENTE
export const updateCliente = async (
    id: number,
    cliente: Omit<Cliente, 'idClientes'>
): Promise<Cliente | null> => {

    try {
        const result = await pool.query(`
            UPDATE Clientes
            SET
                nombrecliente = $1,
                apellido = $2,
                documento = $3,
                telefono = $4
            WHERE "idclientes" = $5
            RETURNING
                "idclientes" AS "idClientes",
                nombrecliente,
                apellido,
                documento,
                telefono
        `, [
            cliente.nombrecliente,
            cliente.apellido,
            cliente.documento,
            cliente.telefono,
            id
        ]);

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0] as Cliente;

    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        throw new Error('Error al actualizar cliente');
    }
};

// ELIMINAR CLIENTE
export const deleteCliente = async (
    id: number
): Promise<boolean> => {

    try {
        const result = await pool.query(`
            DELETE FROM Clientes
            WHERE "idclientes" = $1
            RETURNING "idclientes"
        `, [id]);

        return (
            result.rowCount !== null &&
            result.rowCount > 0
        );

    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        throw new Error('Error al eliminar cliente');
    }
};