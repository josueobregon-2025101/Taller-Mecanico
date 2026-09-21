import pool from '../connection/conexion';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

interface UsuarioBaseDatos {
    idusuario: number;
    nombreusuario: string;
    password: string;
    email: string;
    rol: string;
    estadousuario: string;
}

export interface UsuarioAutenticado {
    idUsuario: number;
    nombreUsuario: string;
    email: string;
    rol: string;
    estadoUsuario: string;
}

export interface RegistroUsuario {
    nombreUsuario: string;
    password: string;
    email: string;
}

export interface LoginUsuario {
    usuario: string;
    password: string;
}

export interface RespuestaAutenticacion {
    token: string;
    usuario: UsuarioAutenticado;
}

const convertirUsuario = (
    usuario: UsuarioBaseDatos
): UsuarioAutenticado => {
    return {
        idUsuario: usuario.idusuario,
        nombreUsuario: usuario.nombreusuario,
        email: usuario.email,
        rol: usuario.rol,
        estadoUsuario: usuario.estadousuario
    };
};

const generarToken = (
    usuario: UsuarioAutenticado
): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error(
            'JWT_SECRET no está configurado en el archivo .env'
        );
    }

    const expiresIn = (
        process.env.JWT_EXPIRES_IN || '8h'
    ) as SignOptions['expiresIn'];

    const token = jwt.sign(
        {
            idUsuario: usuario.idUsuario,
            nombreUsuario: usuario.nombreUsuario,
            rol: usuario.rol
        },
        jwtSecret,
        {
            expiresIn
        }
    );

    return token;
};

export const registrarUsuario = async (
    datos: RegistroUsuario
): Promise<RespuestaAutenticacion> => {
    const nombreUsuario =
        datos.nombreUsuario.trim();

    const email =
        datos.email.trim().toLowerCase();

    const password =
        datos.password;

    if (
        !nombreUsuario ||
        !email ||
        !password
    ) {
        throw new Error(
            'Todos los campos son obligatorios'
        );
    }

    if (password.length < 8) {
        throw new Error(
            'La contraseña debe tener al menos 8 caracteres'
        );
    }

    try {
        const usuarioExistente =
            await pool.query(
                `SELECT idUsuario
                 FROM Usuarios
                 WHERE LOWER(nombreUsuario) = LOWER($1)
                    OR LOWER(email) = LOWER($2)`,
                [
                    nombreUsuario,
                    email
                ]
            );

        if (usuarioExistente.rows.length > 0) {
            throw new Error(
                'El nombre de usuario o correo ya está registrado'
            );
        }

        const passwordProtegida =
            await bcrypt.hash(
                password,
                10
            );

        const resultado =
            await pool.query(
                `INSERT INTO Usuarios
                (
                    nombreUsuario,
                    password,
                    email,
                    rol,
                    estadoUsuario
                )
                VALUES($1,$2,$3,$4,$5)
                RETURNING
                    idUsuario,
                    nombreUsuario,
                    password,
                    email,
                    rol,
                    estadoUsuario`,
                [
                    nombreUsuario,
                    passwordProtegida,
                    email,
                    'Secretario',
                    'Activo'
                ]
            );

        const usuarioBaseDatos =
            resultado.rows[0] as UsuarioBaseDatos;

        const usuario =
            convertirUsuario(
                usuarioBaseDatos
            );

        const token =
            generarToken(usuario);

        return {
            token,
            usuario
        };

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            'Error al registrar el usuario'
        );
    }
};

export const iniciarSesion = async (
    datos: LoginUsuario
): Promise<RespuestaAutenticacion> => {
    const identificador =
        datos.usuario.trim();

    const password =
        datos.password;

    if (
        !identificador ||
        !password
    ) {
        throw new Error(
            'El usuario y la contraseña son obligatorios'
        );
    }

    try {
        const resultado =
            await pool.query(
                `SELECT
                    idUsuario,
                    nombreUsuario,
                    password,
                    email,
                    rol,
                    estadoUsuario
                 FROM Usuarios
                 WHERE LOWER(nombreUsuario) = LOWER($1)
                    OR LOWER(email) = LOWER($1)
                 LIMIT 1`,
                [
                    identificador
                ]
            );

        if (resultado.rows.length === 0) {
            throw new Error(
                'Usuario o contraseña incorrectos'
            );
        }

        const usuarioBaseDatos =
            resultado.rows[0] as UsuarioBaseDatos;

        if (
            usuarioBaseDatos.estadousuario !==
            'Activo'
        ) {
            throw new Error(
                'El usuario se encuentra inactivo'
            );
        }

        const passwordCorrecta =
            await bcrypt.compare(
                password,
                usuarioBaseDatos.password
            );

        if (!passwordCorrecta) {
            throw new Error(
                'Usuario o contraseña incorrectos'
            );
        }

        const usuario =
            convertirUsuario(
                usuarioBaseDatos
            );

        const token =
            generarToken(usuario);

        return {
            token,
            usuario
        };

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            'Error al iniciar sesión'
        );
    }
};