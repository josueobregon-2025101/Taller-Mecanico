import { Request, Response } from 'express';

import * as clienteService from '../Services/clienteService';

export class ClienteController {

    static async getAllClientes(req: Request, res: Response) {

        try {

            const clientes = await clienteService.getAllClientes();

            return res.status(200).json(clientes);

        } catch (error) {

            console.error('Error al obtener clientes:', error);

            return res.status(500).json({
                error: 'Error al obtener clientes'
            });

        }

    }

    static async getClienteById(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });

            }

            const cliente = await clienteService.getClienteById(id);

            if (cliente) {

                return res.status(200).json(cliente);

            } else {

                return res.status(404).json({
                    error: 'Cliente no encontrado'
                });

            }

        } catch (error) {

            console.error('Error al obtener cliente por ID:', error);

            return res.status(500).json({
                error: 'Error al obtener cliente por ID'
            });

        }

    }

    static async createCliente(req: Request, res: Response) {

        try {

            const {
                nombreCliente,
                apellido,
                documento,
                telefono
            } = req.body;

            if (
                !nombreCliente?.trim() ||
                !apellido?.trim() ||
                !documento?.trim() ||
                !telefono?.trim()
            ) {

                return res.status(400).json({
                    error: 'Faltan datos requeridos'
                });

            }

            const nuevoCliente = await clienteService.createCliente({
                nombreCliente,
                apellido,
                documento,
                telefono
            });

            return res.status(201).json({
                status: 'success',
                message: 'Cliente creado exitosamente',
                data: nuevoCliente
            });

        } catch (error) {

            console.error('Error al crear cliente:', error);

            return res.status(500).json({
                error: 'Error al crear cliente'
            });

        }

    }

    static async updateCliente(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });

            }

            const cliente = req.body;

            const clienteActualizado =
                await clienteService.updateCliente(id, cliente);

            if (clienteActualizado) {

                return res.status(200).json({
                    status: 'success',
                    message: 'Cliente actualizado exitosamente',
                    data: clienteActualizado
                });

            } else {

                return res.status(404).json({
                    error: 'Cliente no encontrado'
                });

            }

        } catch (error) {

            console.error('Error al actualizar cliente:', error);

            return res.status(500).json({
                error: 'Error al actualizar cliente'
            });

        }

    }

    static async deleteCliente(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {

                return res.status(400).json({
                    error: 'El ID debe ser un número válido'
                });

            }

            const eliminado = await clienteService.deleteCliente(id);

            if (eliminado) {

                return res.status(200).json({
                    status: 'success',
                    message: 'Cliente eliminado exitosamente'
                });

            } else {

                return res.status(404).json({
                    error: 'Cliente no encontrado'
                });

            }

        } catch (error) {

            console.error('Error al eliminar cliente:', error);

            return res.status(500).json({
                error: 'Error al eliminar cliente'
            });

        }

    }

}