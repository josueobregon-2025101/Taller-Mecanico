import { Request, Response } from 'express';
import * as citaService from '../Services/citaService';

export class CitaController {
    static async getAllCitas(req: Request, res: Response) {
        try {
            const citas = await citaService.getAllCitas();
            res.status(200).json(citas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener citas' });
        }
    }

    static async getCitaById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const cita = await citaService.getCitaById(id);
            if (cita) {
                res.status(200).json(cita);
            } else {
                res.status(404).json({ error: 'Cita no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener cita por ID' });
        }
    }

    static async createCita(req: Request, res: Response) {
        try {
            const { idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita } = req.body;
            if (!idVehiculo || !idClientes || !fecha_hora || !descripción || !estadoCita) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const nuevaCita = await citaService.createCita({ idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita });
            res.status(201).json({
                status: 'success',
                message: 'Cita creada exitosamente',
                data: nuevaCita
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear cita en controller: ' + error });
        }
    }

    static async updateCita(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const { idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita } = req.body;
            if (!idVehiculo || !idClientes || !fecha_hora || !descripción || !estadoCita) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const actualizada = await citaService.updateCita(id, { idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita });
            return res.status(200).json({
                status: 'success',
                message: 'Cita Actualizada Exitosamente',
                result: actualizada
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar actualizar la cita en el Controlador: ' + error });
        }
    }

    static async deleteCita(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const eliminada = await citaService.deleteCita(id);
            if (eliminada === true) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Cita Eliminada correctamente',
                    result: eliminada
                });
            }
            return res.status(404).json({
                status: 'Not Found',
                message: 'No se encontró la Cita',
                result: eliminada
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar eliminar una cita en el controlador: ' + error });
        }
    }
}