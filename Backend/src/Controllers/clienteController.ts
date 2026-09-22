import { Request, Response } from 'express';

import * as clienteService
    from '../Services/clienteService';

export class ClienteController {

    // OBTENER TODOS LOS CLIENTES
    static async getAllClientes(
        req: Request,
        res: Response
    ) {
        try {

            const clientes =
                await clienteService.getAllClientes();

            return res.status(200).json(clientes);

        } catch (error) {

            console.error(
                'Error al obtener clientes:',
                error
            );

            return res.status(500).json({
                error: 'Error al obtener clientes'
            });
        }
    }

    // OBTENER CLIENTE POR ID
    static async getClienteById(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });
            }

            const cliente =
                await clienteService.getClienteById(id);

            if (!cliente) {

                return res.status(404).json({
                    error: 'Cliente no encontrado'
                });
            }

            return res.status(200).json(cliente);

        } catch (error) {

            console.error(
                'Error al obtener cliente:',
                error
            );

            return res.status(500).json({
                error: 'Error al obtener cliente'
            });
        }
    }

    // CREAR CLIENTE
    static async createCliente(
        req: Request,
        res: Response
    ) {
        try {

            const {
                nombrecliente,
                apellido,
                documento,
                telefono
            } = req.body;

            if (
                typeof nombrecliente !== 'string' ||
                typeof apellido !== 'string' ||
                typeof documento !== 'string' ||
                typeof telefono !== 'string'
            ) {

                return res.status(400).json({
                    error: 'Todos los campos son requeridos'
                });
            }

            if (
                !nombrecliente.trim() ||
                !apellido.trim() ||
                !documento.trim() ||
                !telefono.trim()
            ) {

                return res.status(400).json({
                    error: 'Los campos no pueden estar vacíos'
                });
            }

            const nuevoCliente =
                await clienteService.createCliente({
                    nombrecliente:
                        nombrecliente.trim(),

                    apellido:
                        apellido.trim(),

                    documento:
                        documento.trim(),

                    telefono:
                        telefono.trim()
                });

            return res.status(201).json({
                status: 'success',
                message: 'Cliente creado exitosamente',
                data: nuevoCliente
            });

        } catch (error) {

            console.error(
                'Error al crear cliente:',
                error
            );

            return res.status(500).json({
                error: 'Error al crear cliente'
            });
        }
    }

    // ACTUALIZAR CLIENTE
    static async updateCliente(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });
            }

            const {
                nombrecliente,
                apellido,
                documento,
                telefono
            } = req.body;

            // Validar que Angular esté enviando
            // exactamente los campos esperados
            if (
                typeof nombrecliente !== 'string' ||
                typeof apellido !== 'string' ||
                typeof documento !== 'string' ||
                typeof telefono !== 'string'
            ) {

                return res.status(400).json({
                    error:
                        'Los campos nombrecliente, apellido, documento y telefono son requeridos'
                });
            }

            if (
                !nombrecliente.trim() ||
                !apellido.trim() ||
                !documento.trim() ||
                !telefono.trim()
            ) {

                return res.status(400).json({
                    error:
                        'Los campos no pueden estar vacíos'
                });
            }

            const clienteActualizado =
                await clienteService.updateCliente(
                    id,
                    {
                        nombrecliente:
                            nombrecliente.trim(),

                        apellido:
                            apellido.trim(),

                        documento:
                            documento.trim(),

                        telefono:
                            telefono.trim()
                    }
                );

            if (!clienteActualizado) {

                return res.status(404).json({
                    error: 'Cliente no encontrado'
                });
            }

            return res.status(200).json({
                status: 'success',
                message:
                    'Cliente actualizado exitosamente',
                data: clienteActualizado
            });

        } catch (error) {

            console.error(
                'Error al actualizar cliente:',
                error
            );

            return res.status(500).json({
                error:
                    'Error al actualizar cliente'
            });
        }
    }

    // ELIMINAR CLIENTE
    static async deleteCliente(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    error:
                        'El ID debe ser un número válido'
                });
            }

            const eliminado =
                await clienteService.deleteCliente(id);

            if (!eliminado) {

                return res.status(404).json({
                    error: 'Cliente no encontrado'
                });
            }

            return res.status(200).json({
                status: 'success',
                message:
                    'Cliente eliminado exitosamente'
            });

        } catch (error: any) {

            console.error(
                'Error al eliminar cliente:',
                error
            );

            // Cliente relacionado con otras tablas
            if (error?.code === '23503') {

                return res.status(409).json({
                    error:
                        'No se puede eliminar este cliente porque tiene vehículos, citas, servicios o ventas asociados.'
                });
            }

            return res.status(500).json({
                error:
                    'Error al eliminar cliente'
            });
        }
    }
}