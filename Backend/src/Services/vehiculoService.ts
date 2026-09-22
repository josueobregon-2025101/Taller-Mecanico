import pool from '../connection/conexion';
import { Vehiculo } from '../Models/Vehiculo';

export const getAllVehiculos = async (): Promise<Vehiculo[]> => {

    try {

        const result = await pool.query(`
            SELECT
                "idvehiculo" AS "idVehiculo",
                "idclientes" AS "idClientes",
                placa,
                marca,
                modelo,
                "año" AS ano,
                kilometraje_total
            FROM Vehiculos
            ORDER BY "idvehiculo" ASC
        `);

        return result.rows as Vehiculo[];

    } catch (error) {

        console.error(
            'Error al obtener vehículos:',
            error
        );

        throw new Error(
            'Error al obtener vehículos'
        );

    }

};


export const getVehiculoById = async (
    id: number
): Promise<Vehiculo | null> => {

    try {

        const result = await pool.query(`
            SELECT
                "idvehiculo" AS "idVehiculo",
                "idclientes" AS "idClientes",
                placa,
                marca,
                modelo,
                "año" AS ano,
                kilometraje_total
            FROM Vehiculos
            WHERE "idvehiculo" = $1
        `, [id]);

        return result.rows[0] || null;

    } catch (error) {

        console.error(
            'Error al obtener vehículo:',
            error
        );

        throw new Error(
            'Error al obtener vehículo'
        );

    }

};


export const createVehiculo = async (
    vehiculo: Omit<Vehiculo, 'idVehiculo'>
): Promise<Vehiculo> => {

    try {

        const result = await pool.query(`
            INSERT INTO Vehiculos
            (
                idClientes,
                placa,
                marca,
                modelo,
                "año",
                kilometraje_total
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                "idvehiculo" AS "idVehiculo",
                "idclientes" AS "idClientes",
                placa,
                marca,
                modelo,
                "año" AS ano,
                kilometraje_total
        `,
        [
            vehiculo.idClientes,
            vehiculo.placa,
            vehiculo.marca,
            vehiculo.modelo,
            vehiculo.ano,
            vehiculo.kilometraje_total
        ]);

        return result.rows[0] as Vehiculo;

    } catch (error) {

        console.error(
            'Error al crear vehículo:',
            error
        );

        throw new Error(
            'Error al crear vehículo'
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
        'ano',
        'kilometraje_total'
    ];

    const campos = Object.keys(vehiculo)
        .filter(campo =>
            camposPermitidos.includes(campo)
        );

    if (campos.length === 0) {

        throw new Error(
            'No hay campos válidos para actualizar'
        );

    }

    const valores = campos.map(
        campo =>
            vehiculo[
                campo as keyof Vehiculo
            ]
    );

    const expresiones = campos.map(
        (campo, index) => {

            if (campo === 'ano') {
                return `"año" = $${index + 1}`;
            }

            return `${campo} = $${index + 1}`;

        }
    );

    const setClause =
        expresiones.join(', ');

    try {

        const result = await pool.query(`
            UPDATE Vehiculos
            SET ${setClause}
            WHERE "idvehiculo" = $${valores.length + 1}
            RETURNING
                "idvehiculo" AS "idVehiculo",
                "idclientes" AS "idClientes",
                placa,
                marca,
                modelo,
                "año" AS ano,
                kilometraje_total
        `,
        [
            ...valores,
            id
        ]);

        return result.rows[0] || null;

    } catch (error) {

        console.error(
            'Error al actualizar vehículo:',
            error
        );

        throw new Error(
            'Error al actualizar vehículo'
        );

    }

};


export const deleteVehiculo = async (
    id: number
): Promise<boolean> => {

    try {

        const result = await pool.query(`
            DELETE FROM Vehiculos
            WHERE "idvehiculo" = $1
            RETURNING "idvehiculo"
        `, [id]);

        return result.rowCount !== null &&
               result.rowCount > 0;

    } catch (error) {

        console.error(
            'Error al eliminar vehículo:',
            error
        );

        throw new Error(
            'Error al eliminar vehículo'
        );

    }

};