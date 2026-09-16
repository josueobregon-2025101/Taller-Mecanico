import { Request, Response } from 'express';
import * as servicioService from '../Services/servicioService';

export class ServicioController {

    static async getAllServicios(req: Request, res: Response) {
        try {
            const servicios = await servicioService.getAllServicios();
            res.status(200).json(servicios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener servicios' });
        }
    }

    static async getServicioById(req: Request, res: Response) {
        try {

            const id = parseInt(req.params.id as string);

            const servicio = await servicioService.getServicioById(id);

            if (servicio) {
                res.status(200).json(servicio);
            } else {
                res.status(404).json({ error: 'Servicio no encontrado' });
            }

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener servicio por ID' });
        }
    }

    static async createServicio(req: Request, res: Response) {
        try {

            const {idVehiculos,idCliente,idEmpleado,idCita,fecha_ingreso,fecha_entrega,diagnostico,estadoServicio,kilometraje_ing
            } = req.body;

            if (!idVehiculos ||!idCliente ||!idEmpleado ||!fecha_ingreso ||!diagnostico ||!estadoServicio ||
                !kilometraje_ing) {
                return res.status(400).json({error: 'Faltan datos requeridos'
                });
            }

            const nuevoServicio = await servicioService.createServicio({idVehiculos,idCliente,idEmpleado,idCita,fecha_ingreso,
                fecha_entrega,diagnostico,estadoServicio,kilometraje_ing
            });

            res.status(201).json({
                status: 'success',
                message: 'Servicio creado exitosamente',
                data: nuevoServicio
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al crear servicio en controller ' + error
            });
        }
    }

    static async updateServicio(req: Request, res: Response) {
        try {

            const id = parseInt(req.params.id as string);

            const {idVehiculos,idCliente,idEmpleado,idCita,fecha_ingreso,fecha_entrega,diagnostico,estadoServicio,
                kilometraje_ing} = req.body;

            const servicio = {idVehiculos,idCliente,idEmpleado,idCita,fecha_ingreso,fecha_entrega,diagnostico,
                estadoServicio,kilometraje_ing
            };

            const actualizado = await servicioService.updateServicio(
                id,servicio
            );

            return res.status(200).json({
                status: 'succes',
                message: 'Servicio actualizado exitosamente',
                result: actualizado
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al intentar actualizar servicio en el controlador ' + error
            });
        }
    }

    static async deleteServicio(req: Request, res: Response) {
        try {

            const id = parseInt(req.params.id as string);

            const eliminado = await servicioService.deleteServicio(id);

            if (eliminado === true) {
                return res.status(200).json({
                    status: 'succes',
                    message: 'Servicio eliminado exitosamente',
                    result: eliminado
                });
            }

            return res.status(404).json({
                status: 'Not Found',
                message: 'No se encontro el servicio',
                result: eliminado
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al intentar eliminar servicio en el controlador ' + error
            });
        }
    }
}