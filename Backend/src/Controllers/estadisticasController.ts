import * as estadisticasService from "../Services/estadisticasService"
import { Request,Response } from "express"

export class EstadisticasController {

    static async getEstadisticas(req:Request,res:Response){
        try {
            const respuesta = await estadisticasService.estadisticasService.obtener();
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).json({error:'Error al intentar obtener las estadisticas '+error})
        }
    }
}