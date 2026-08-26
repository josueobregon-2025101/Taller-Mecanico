import { Request, Response } from 'express';

import * as clienteService from '../Services/clienteService';

export class ClienteController {

    static async getAllClientes(req: Request, res: Response) {

        try {

            const clientes = await clienteService.getAllClientes();

            res.status(200).json(clientes);

        } catch (error) {

            res.status(500).json({ error: 'Error al obtener clientes' });

        }

    }

    static async getClienteById(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            const cliente = await clienteService.getClienteById(id);

            if (cliente) {

                res.status(200).json(cliente);

            } else {

                res.status(404).json({ error: 'Cliente no encontrado' });

            }

        } catch (error) {

            res.status(500).json({ error: 'Error al obtener cliente por ID' });

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

            if (!nombreCliente || !apellido || !documento || !telefono) {

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

            res.status(201).json({
                status: 'success',
                message: 'Cliente creado exitosamente',
                data: nuevoCliente
            });

        } catch (error) {

            res.status(500).json({
                error: 'Error al crear cliente'
            });

        }

    }

    static async updateCliente(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            const cliente = req.body;

            const clienteActualizado = await clienteService.updateCliente(id, cliente);

            if (clienteActualizado) {

                res.status(200).json({
                    status: 'success',
                    message: 'Cliente actualizado exitosamente',
                    data: clienteActualizado
                });

            } else {

                res.status(404).json({
                    error: 'Cliente no encontrado'
                });

            }

        } catch (error) {

            res.status(500).json({
                error: 'Error al actualizar cliente'
            });

        }

    }

    static async deleteCliente(req: Request, res: Response) {

        try {

            const id = parseInt(req.params.id as string);

            const eliminado = await clienteService.deleteCliente(id);

            if (eliminado) {

                res.status(200).json({
                    status: 'success',
                    message: 'Cliente eliminado exitosamente'
                });

            } else {

                res.status(404).json({
                    error: 'Cliente no encontrado'
                });

            }

        } catch (error) {

            res.status(500).json({
                error: 'Error al eliminar cliente'
            });

        }

    }

}