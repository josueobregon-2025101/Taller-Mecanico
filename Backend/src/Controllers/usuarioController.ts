import { Request, Response } from 'express';
import * as usuarioService from '../Services/usuarioService';

export class UsuarioController {
    static async getAllUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await usuarioService.getAllUsuarios();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    static async getUsuarioById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const usuario = await usuarioService.getUsuarioById(id);
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuario por ID' });
        }
    }

    static async createUsuario(req: Request, res: Response) {
        try {
            const { nombreUsuario, password, email, rol, estadoUsuario } = req.body;
            if (!nombreUsuario || !password || !email || !rol || !estadoUsuario) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const nuevoUsuario = await usuarioService.createUsuario({ nombreUsuario, password, email, rol, estadoUsuario });
            res.status(201).json({
                status: 'success',
                message: 'Usuario creado exitosamente',
                data: nuevoUsuario
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear usuario en controller: ' + error });
        }
    }

    static async updateUsuario(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const { nombreUsuario, password, email, rol, estadoUsuario } = req.body;
            if (!nombreUsuario || !password || !email || !rol || !estadoUsuario) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const actualizado = await usuarioService.updateUsuario(id, { nombreUsuario, password, email, rol, estadoUsuario });
            return res.status(200).json({
                status: 'success',
                message: 'Usuario Actualizado Exitosamente',
                result: actualizado
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar actualizar el usuario en el Controlador: ' + error });
        }
    }

    static async deleteUsuario(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const eliminado = await usuarioService.deleteUsuario(id);
            if (eliminado === true) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Usuario Eliminado correctamente',
                    result: eliminado
                });
            }
            return res.status(404).json({
                status: 'Not Found',
                message: 'No se encontró el Usuario',
                result: eliminado
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar eliminar un usuario en el controlador: ' + error });
        }
    }
}