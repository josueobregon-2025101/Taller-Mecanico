import { Request, Response } from 'express';

import * as vehiculoService from '../Services/vehiculoService';

export class VehiculoController {

    static async getAllVehiculos(req: Request, res: Response) {

        try {

            const vehiculos = await vehiculoService.getAllVehiculos();

            res.status(200).json(vehiculos);

        } catch (error) {

            res.status(500).json({
                error: 'Error al obtener vehículos'
            });

        }

    }

    static async getVehiculoById(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            const vehiculo = await vehiculoService.getVehiculoById(id);

            if (vehiculo) {

                res.status(200).json(vehiculo);

            } else {

                res.status(404).json({
                    error: 'Vehículo no encontrado'
                });

            }

        } catch (error) {

            res.status(500).json({
                error: 'Error al obtener vehículo por ID'
            });

        }

    }

    static async createVehiculo(req: Request, res: Response) {

        try {

            const {
                idClientes,
                placa,
                marca,
                modelo,
                año,
                kilometraje_actual
            } = req.body;

            if (
                !idClientes ||
                !placa ||
                !marca ||
                !modelo ||
                !año ||
                !kilometraje_actual
            ) {

                return res.status(400).json({
                    error: 'Faltan datos requeridos'
                });

            }

            const nuevoVehiculo = await vehiculoService.createVehiculo({
                idClientes,
                placa,
                marca,
                modelo,
                año,
                kilometraje_actual
            });

            res.status(201).json({
                status: 'success',
                message: 'Vehículo creado exitosamente',
                data: nuevoVehiculo
            });

        } catch (error) {

            res.status(500).json({
                error: 'Error al crear vehículo'
            });

        }

    }

    static async updateVehiculo(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            const vehiculo = req.body;

            const vehiculoActualizado =
                await vehiculoService.updateVehiculo(id, vehiculo);

            if (vehiculoActualizado) {

                res.status(200).json({
                    status: 'success',
                    message: 'Vehículo actualizado exitosamente',
                    data: vehiculoActualizado
                });

            } else {

                res.status(404).json({
                    error: 'Vehículo no encontrado'
                });

            }

        } catch (error) {

            res.status(500).json({
                error: 'Error al actualizar vehículo'
            });

        }

    }

    static async deleteVehiculo(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            const eliminado = await vehiculoService.deleteVehiculo(id);

            if (eliminado) {

                res.status(200).json({
                    status: 'success',
                    message: 'Vehículo eliminado exitosamente'
                });

            } else {

                res.status(404).json({
                    error: 'Vehículo no encontrado'
                });

            }

        } catch (error) {

            res.status(500).json({
                error: 'Error al eliminar vehículo'
            });

        }

    }

}