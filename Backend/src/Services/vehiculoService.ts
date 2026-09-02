import pool from '../connection/conexion';
import { Vehiculo } from '../Models/Vehiculo';

export const getAllVehiculos = async (): Promise<Vehiculo[]> => {

    try {

        const result = await pool.query(
            'SELECT * FROM Vehiculos'
        );

        return result.rows;

    } catch (error) {

        throw new Error(
            'Error al obtener vehículos: ' + error
        );

    }

};


export const getVehiculoById = async (
    id: number
): Promise<Vehiculo | null> => {

    try {

        const result = await pool.query(
            'SELECT * FROM Vehiculos WHERE idVehiculo = $1',
            [id]
        );

        return result.rows[0] || null;

    } catch (error) {

        throw new Error(
            'Error al obtener vehículo: ' + error
        );

    }

};


export const createVehiculo = async (
    vehiculo: Omit<Vehiculo, 'idVehiculo'>
): Promise<Vehiculo> => {

    const {
        idClientes,
        placa,
        marca,
        modelo,
        año,
        kilometraje_total
    } = vehiculo;

    try {

        const result = await pool.query(
            `INSERT INTO Vehiculos 
            (idClientes, placa, marca, modelo, año, kilometraje_total)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                idClientes,
                placa,
                marca,
                modelo,
                año,
                kilometraje_total
            ]
        );

        return result.rows[0];

    } catch (error) {

        throw new Error(
            'Error al crear vehículo: ' + error
        );

    }

};


export const updateVehiculo = async (
    id: number,
    vehiculo: Partial<Vehiculo>
): Promise<Vehiculo | null> => {

    const camposPermitidos = [
        'idClientes',
        'placa',
        'marca',
        'modelo',
        'año',
        'kilometraje_total'
    ];

    const campos = Object.keys(vehiculo)
        .filter(key => camposPermitidos.includes(key));

    if (campos.length === 0) {

        throw new Error(
            'No hay campos válidos para actualizar'
        );

    }

    const values = campos.map(
        campo => vehiculo[campo as keyof Vehiculo]
    );

    const fields = campos
        .map(
            (campo, index) =>
                `${campo} = $${index + 1}`
        )
        .join(', ');

    try {

        const result = await pool.query(
            `UPDATE Vehiculos
             SET ${fields}
             WHERE idVehiculo = $${values.length + 1}
             RETURNING *`,
            [
                ...values,
                id
            ]
        );

        return result.rows[0] || null;

    } catch (error) {

        throw new Error(
            'Error al actualizar vehículo: ' + error
        );

    }

};


export const deleteVehiculo = async (
    id: number
): Promise<boolean> => {

    try {

        const result = await pool.query(
            'DELETE FROM Vehiculos WHERE idVehiculo = $1 RETURNING *',
            [id]
        );

        return result.rowCount ? true : false;

    } catch (error) {

        throw new Error(
            'Error al eliminar vehículo: ' + error
        );

    }

};