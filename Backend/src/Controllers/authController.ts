import { Request, Response } from 'express';
import * as authService from '../Services/authService';

export class AuthController {

    static async registrar(
        req: Request,
        res: Response
    ) {
        try {
            const {
                nombreUsuario,
                password,
                email
            } = req.body;

            if (
                !nombreUsuario ||
                !password ||
                !email
            ) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Faltan datos requeridos'
                });
            }

            const resultado =
                await authService.registrarUsuario({
                    nombreUsuario,
                    password,
                    email
                });

            return res.status(201).json({
                status: 'success',
                message: 'Usuario registrado exitosamente',
                token: resultado.token,
                usuario: resultado.usuario
            });

        } catch (error) {
            const mensaje =
                error instanceof Error
                    ? error.message
                    : 'Error al registrar el usuario';

            if (
                mensaje ===
                'El nombre de usuario o correo ya está registrado'
            ) {
                return res.status(409).json({
                    status: 'error',
                    message: mensaje
                });
            }

            if (
                mensaje ===
                'La contraseña debe tener al menos 8 caracteres' ||
                mensaje ===
                'Todos los campos son obligatorios'
            ) {
                return res.status(400).json({
                    status: 'error',
                    message: mensaje
                });
            }

            console.error(
                'Error al registrar usuario:',
                error
            );

            return res.status(500).json({
                status: 'error',
                message: 'Error interno al registrar el usuario'
            });
        }
    }

    static async login(
        req: Request,
        res: Response
    ) {
        try {
            const {
                usuario,
                password
            } = req.body;

            if (
                !usuario ||
                !password
            ) {
                return res.status(400).json({
                    status: 'error',
                    message:
                        'El usuario y la contraseña son obligatorios'
                });
            }

            const resultado =
                await authService.iniciarSesion({
                    usuario,
                    password
                });

            return res.status(200).json({
                status: 'success',
                message: 'Inicio de sesión exitoso',
                token: resultado.token,
                usuario: resultado.usuario
            });

        } catch (error) {
            const mensaje =
                error instanceof Error
                    ? error.message
                    : 'Error al iniciar sesión';

            if (
                mensaje ===
                'Usuario o contraseña incorrectos'
            ) {
                return res.status(401).json({
                    status: 'error',
                    message: mensaje
                });
            }

            if (
                mensaje ===
                'El usuario se encuentra inactivo'
            ) {
                return res.status(403).json({
                    status: 'error',
                    message: mensaje
                });
            }

            if (
                mensaje ===
                'El usuario y la contraseña son obligatorios'
            ) {
                return res.status(400).json({
                    status: 'error',
                    message: mensaje
                });
            }

            console.error(
                'Error al iniciar sesión:',
                error
            );

            return res.status(500).json({
                status: 'error',
                message: 'Error interno al iniciar sesión'
            });
        }
    }
}