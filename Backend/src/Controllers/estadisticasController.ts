import { Request, Response } from 'express';
import * as estadisticasService from '../Services/estadisticasService';

export class EstadisticasController {

    static async getEstadisticas(
        req: Request,
        res: Response
    ) {
        try {
            const respuesta =
                await estadisticasService
                    .estadisticasService
                    .obtener();

            return res
                .status(200)
                .json(respuesta);

        } catch (error) {
            console.error(
                'Error al obtener estadísticas:',
                error
            );

            return res.status(500).json({
                error:
                    'Error al intentar obtener las estadísticas'
            });
        }
    }

    static async getActividadReciente(
        req: Request,
        res: Response
    ) {
        try {
            const actividad =
                await estadisticasService
                    .estadisticasService
                    .obtenerActividad();

            return res.status(200).json(
                actividad
            );

        } catch (error) {
            console.error(
                'Error al obtener actividad reciente:',
                error
            );

            return res.status(500).json({
                error:
                    'Error al intentar obtener la actividad reciente'
            });
        }
    }
}