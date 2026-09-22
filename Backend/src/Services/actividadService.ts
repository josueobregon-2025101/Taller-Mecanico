import pool from '../connection/conexion';

export interface NuevaActividad {
    tipo: string;
    accion: string;
    idRegistro?: number | null;
    titulo: string;
    descripcion: string;
    estado?: string | null;
    idUsuario?: number | null;
}

export interface ActividadSistema {
    idActividad: number;
    tipo: string;
    accion: string;
    idRegistro: number | null;
    titulo: string;
    descripcion: string;
    estado: string | null;
    idUsuario: number | null;
    fecha: string;
}

export const registrarActividad = async (
    actividad: NuevaActividad
): Promise<void> => {
    try {
        await pool.query(
            `INSERT INTO Actividad_Sistema
            (tipo,accion, idRegistro, titulo,
             descripcion, estado,
            idUsuario
            )
            VALUES($1,$2,$3,$4,$5,$6,$7)`,
            [actividad.tipo,actividad.accion,actividad.idRegistro ?? null,actividad.titulo,actividad.descripcion,
            actividad.estado ?? null,actividad.idUsuario ?? null ]
        );

    } catch (error) {console.error( 'No fue posible registrar la actividad:',error );
    }
};

export const obtenerActividadesRecientes = async (
    limite: number = 15
): Promise<ActividadSistema[]> => {
    try {const limiteSeguro = Math.max(1, Math.min(limite, 50) );

        const resultado = await pool.query(
            `SELECT
              idActividad,
                tipo,
                accion,
                idRegistro,
                titulo,
                descripcion,
                estado,
                idUsuario,
                fecha
            FROM Actividad_Sistema
            ORDER BY fecha DESC, idActividad DESC
            LIMIT $1`,
            [limiteSeguro]
        );

        return resultado.rows.map((actividad) => {
            return {
                idActividad:Number(actividad.idactividad),
                tipo:actividad.tipo,
                accion: actividad.accion,
                idRegistro:actividad.idregistro !== null
                        ? Number(actividad.idregistro)
                        : null,
                titulo: actividad.titulo,
                descripcion:actividad.descripcion,
                estado: actividad.estado,
                idUsuario:actividad.idusuario !== null
                        ? Number(actividad.idusuario)
                        : null,
                fecha: actividad.fecha
            };
        });

    } catch (error) {
        throw new Error( 'Error al obtener las actividades recientes: ' +error );
    }
};