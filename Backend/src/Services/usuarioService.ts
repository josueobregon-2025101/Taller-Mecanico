import pool from '../connection/conexion';
import { Usuario } from '../Models/Usuario';

export const getAllUsuarios = async (): Promise<Usuario[]> => {
    try {
        const result = await pool.query('SELECT * FROM Usuarios');
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener usuarios: ' + error);
    }
};

export const getUsuarioById = async (id: number): Promise<Usuario | null> => {
    try {
        const result = await pool.query('SELECT * FROM Usuarios WHERE "idUsuario" = $1', [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al obtener usuario: ' + error);
    }
};

export const createUsuario = async (usuario: Omit<Usuario, 'idUsuario'>): Promise<Usuario> => {
    const { nombreUsuario, password, email, rol, estadoUsuario } = usuario;
    try {
        const result = await pool.query(
            `INSERT INTO Usuarios (nombreUsuario, password, email, rol, estadoUsuario)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombreUsuario, password, email, rol, estadoUsuario]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al crear usuario: ' + error);
    }
};

export const updateUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario | null> => {
    const fields = Object.keys(usuario).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = Object.values(usuario);
    if (fields.length === 0) throw new Error('No hay campos para actualizar');
    try {
        const result = await pool.query(
            `UPDATE Usuarios SET ${fields} WHERE "idUsuario" = $${values.length + 1} RETURNING *`,
            [...values, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al actualizar usuario: ' + error);
    }
};

export const deleteUsuario = async (id: number): Promise<boolean> => {
    try {
        const result = await pool.query('DELETE FROM Usuarios WHERE "idUsuario" = $1 RETURNING *', [id]);
        return result.rowCount ? true : false;
    } catch (error) {
        throw new Error('Error al eliminar usuario: ' + error);
    }
};