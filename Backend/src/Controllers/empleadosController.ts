import { Request, Response } from 'express';
import * as empleadoService from '../Services/empleadoService';

export class EmpleadoController {
    static async getAllEmpleados(req: Request, res: Response) {
        try {
            const empleados = await empleadoService.getAllEmpleados();
            res.status(200).json(empleados);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener empleados' });
        }
    }

    static async getEmpleadoById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const empleado = await empleadoService.getEmpleadoById(id);
            if (empleado) {
                res.status(200).json(empleado);
            } else {
                res.status(404).json({ error: 'Empleado no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener empleado por ID' });
        }
    }

    static async createEmpleado(req: Request, res: Response) {
        try {
            const { nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado } = req.body;
            if (!nombreEmpleado || !apellidoEmpleado || !cedula || !telefonoEmpleado || !puesto || !estadoEmpleado) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const nuevoEmpleado = await empleadoService.createEmpleado({ nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado });
            res.status(201).json({
                status: 'success',
                message: 'Empleado creado exitosamente',
                data: nuevoEmpleado
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear empleado en controller: ' + error });
        }
    }

    static async updateEmpleado(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const { nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado } = req.body;
            if (!nombreEmpleado || !apellidoEmpleado || !cedula || !telefonoEmpleado || !puesto || !estadoEmpleado) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const actualizado = await empleadoService.updateEmpleado(id, { nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado });
            return res.status(200).json({
                status: 'success',
                message: 'Empleado Actualizado Exitosamente',
                result: actualizado
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar actualizar el empleado en el Controlador: ' + error });
        }
    }

    static async deleteEmpleado(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const eliminado = await empleadoService.deleteEmpleado(id);
            if (eliminado === true) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Empleado Eliminado correctamente',
                    result: eliminado
                });
            }
            return res.status(404).json({
                status: 'Not Found',
                message: 'No se encontró el Empleado',
                result: eliminado
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar eliminar un empleado en el controlador: ' + error });
        }
    }
}