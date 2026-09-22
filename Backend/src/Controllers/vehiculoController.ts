import { Request, Response } from 'express';

import * as vehiculoService from '../Services/vehiculoService';

export class VehiculoController {

    static async getAllVehiculos(
        req: Request,
        res: Response
    ) {

        try {

            const vehiculos =
                await vehiculoService.getAllVehiculos();

            return res.status(200).json(vehiculos);

        } catch (error) {

            console.error(
                'Error al obtener vehículos:',
                error
            );

            return res.status(500).json({
                error: 'Error al obtener vehículos'
            });

        }

    }


    static async getVehiculoById(
        req: Request,
        res: Response
    ) {

        try {

            const id =
                Number(req.params.id);

            if (!Number.isInteger(id)) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });

            }

            const vehiculo =
                await vehiculoService.getVehiculoById(id);

            if (!vehiculo) {

                return res.status(404).json({
                    error: 'Vehículo no encontrado'
                });

            }

            return res.status(200).json(vehiculo);

        } catch (error) {

            console.error(
                'Error al obtener vehículo:',
                error
            );

            return res.status(500).json({
                error: 'Error al obtener vehículo'
            });

        }

    }


    static async createVehiculo(
        req: Request,
        res: Response
    ) {

        try {

            const {
                idClientes,
                placa,
                marca,
                modelo,
                ano,
                kilometraje_total
            } = req.body;

            if (
                idClientes === undefined ||
                !placa?.trim() ||
                !marca?.trim() ||
                !modelo?.trim() ||
                ano === undefined ||
                kilometraje_total === undefined
            ) {

                return res.status(400).json({
                    error: 'Faltan datos requeridos'
                });

            }

            const nuevoVehiculo =
                await vehiculoService.createVehiculo({
                    idClientes: Number(idClientes),
                    placa: placa.trim(),
                    marca: marca.trim(),
                    modelo: modelo.trim(),
                    ano: Number(ano),
                    kilometraje_total:
                        String(kilometraje_total)
                });

            return res.status(201).json({
                status: 'success',
                message: 'Vehículo creado exitosamente',
                data: nuevoVehiculo
            });

        } catch (error) {

            console.error(
                'Error al crear vehículo:',
                error
            );

            return res.status(500).json({
                error: 'Error al crear vehículo'
            });

        }

    }


    static async updateVehiculo(
        req: Request,
        res: Response
    ) {

        try {

            const id =
                Number(req.params.id);

            if (!Number.isInteger(id)) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });

            }

            const vehiculoActualizado =
                await vehiculoService.updateVehiculo(
                    id,
                    req.body
                );

            if (!vehiculoActualizado) {

                return res.status(404).json({
                    error: 'Vehículo no encontrado'
                });

            }

            return res.status(200).json({
                status: 'success',
                message:
                    'Vehículo actualizado exitosamente',
                data: vehiculoActualizado
            });

        } catch (error) {

            console.error(
                'Error al actualizar vehículo:',
                error
            );

            return res.status(500).json({
                error: 'Error al actualizar vehículo'
            });

        }

    }


    static async deleteVehiculo(
        req: Request,
        res: Response
    ) {

        try {

            const id =
                Number(req.params.id);

            if (!Number.isInteger(id)) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });

            }

            const eliminado =
                await vehiculoService.deleteVehiculo(id);

            if (!eliminado) {

                return res.status(404).json({
                    error: 'Vehículo no encontrado'
                });

            }

            return res.status(200).json({
                status: 'success',
                message:
                    'Vehículo eliminado exitosamente'
            });

        } catch (error) {

            console.error(
                'Error al eliminar vehículo:',
                error
            );

            return res.status(500).json({
                error: 'Error al eliminar vehículo'
            });

        }

    }

}