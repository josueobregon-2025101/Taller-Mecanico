import { Request, Response } from 'express';
import * as detalleServicioService from '../Services/detalleServicioService';

export class DetalleServicioController {

    static async getAllDetalleServicios(req: Request, res: Response) {
        try {
            const detalles = await detalleServicioService.getAllDetalleServicios();
            res.status(200).json(detalles);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener detalles de servicio' });
        }
    }

    static async getDetalleServicioById(req: Request, res: Response) {
        try {

            const id = parseInt(req.params.id as string);

            const detalle = await detalleServicioService.getDetalleServicioById(id);

            if (detalle) {
                res.status(200).json(detalle);
            } else {
                res.status(404).json({ error: 'Detalle de servicio no encontrado' });
            }

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener detalle de servicio por ID' });
        }
    }

    static async createDetalleServicio(req: Request, res: Response) {
        try {

            const {idServicio,descripcionDetalle,cantidadHoras,idInventario,
                cantidad_repuesto,precio_unitario} = req.body;

            if (!idServicio ||!descripcionDetalle ||cantidadHoras === undefined ||!precio_unitario
            ) {
                return res.status(400).json({error: 'Faltan datos requeridos'
                });
            }

            const nuevoDetalle = await detalleServicioService.createDetalleServicio({idServicio,descripcionDetalle,
                cantidadHoras,idInventario,cantidad_repuesto,precio_unitario
            });

            res.status(201).json({
                status: 'success',
                message: 'Detalle de servicio creado exitosamente',
                data: nuevoDetalle
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al crear detalle de servicio en controller ' + error
            });
        }
    }

    static async updateDetalleServicio(req: Request, res: Response) {
        try {

            const id = parseInt(req.params.id as string);

            const {idServicio,descripcionDetalle,cantidadHoras,idInventario,cantidad_repuesto,precio_unitario} = req.body;
            const detalleServicio = {idServicio,descripcionDetalle,cantidadHoras,idInventario,cantidad_repuesto,precio_unitario
            };

            const actualizado = await detalleServicioService.updateDetalleServicio(
                id,detalleServicio
            );

            return res.status(200).json({
                status: 'succes',
                message: 'Detalle de servicio actualizado exitosamente',
                result: actualizado
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al intentar actualizar detalle de servicio en el controlador ' + error
            });
        }
    }

    static async deleteDetalleServicio(req: Request, res: Response) {
        try {

            const id = parseInt(req.params.id as string);
            const eliminado = await detalleServicioService.deleteDetalleServicio(id);
            if (eliminado === true) {
                return res.status(200).json({
    status: 'succes',
                    message: 'Detalle de servicio eliminado exitosamente',
                    result: eliminado
                });
            }

            return res.status(404).json({
                status: 'Not Found',
                message: 'No se encontro el detalle de servicio',
                result: eliminado
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al intentar eliminar detalle de servicio en el controlador ' + error
            });
        }
    }
}