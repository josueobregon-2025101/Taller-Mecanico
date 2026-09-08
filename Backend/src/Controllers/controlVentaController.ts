import * as ControlVService from "../Services/ControlVentaService"
import { Response,Request } from "express"

export class ControlVController{
    static async getAllControlVenta(req:Request,res:Response){
        try {
            const recursos =await ControlVService.getAllControlVenta();
            res.status(200).json(recursos);
        } catch (error) {
            res.status(500).json({error: 'Error al intentar obtener los controles de ventas en el controlador: '+error});
        }
    }

    static async getControlVById(req:Request,res:Response){
        try {
            const id = parseInt(req.params.id as string);
            const recurso = await ControlVService.getControlVentaById(id);
            if(recurso){
                res.status(200).json(recurso);
            }
            res.status(404).json({error: 'Control de venta no encontrado'});
        } catch (error) {
            res.status(500).json({error:'Error al obtener Control de venta por ID: '+error});
        }
    }

    static async createControlV(req:Request,res:Response){
        try {
            const { idServicio,idCliente,fecha,subtotal,impuesto,total,forma_pago,estadoVenta } = req.body;
            if(!idServicio|| !idCliente|| !fecha|| !subtotal|| !impuesto|| !total|| !forma_pago|| !estadoVenta){
                return res.status(400).json({error: "Faltan datos para el control de venta"});
            }
            const respuesta = await ControlVService.createControlVenta({idServicio,idCliente,fecha,subtotal,impuesto,total,forma_pago,estadoVenta});
            res.status(200).json({
                status:"success",
                message: "Control Creado Exitosamente",
                data: respuesta
            })
        } catch (error) {
            res.status(500).json({ error: "Ocurrio un error al crear el Control de venta: "+ error})
            
        }
    }

    static async updateControlVenta(req:Request,res:Response){
        try {
            const id = parseInt(req.params.id as string);
            const {idServicio,idCliente,fecha,subtotal,impuesto,total,forma_pago,estadoVenta} = req.body;
            const controlV =  {idServicio,idCliente,fecha,subtotal,impuesto,total,forma_pago,estadoVenta} ;
            if (!idServicio || !idCliente || !fecha ||!subtotal||!impuesto||!total||!forma_pago||!estadoVenta) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const respuesta = await ControlVService.updateControlVenta(id,controlV);
            return res.status(200).json({
                status: "success",
                message:"Se actualizo el recurso",
                data: respuesta
            });
        } catch (error) {
            res.status(500).json({error: `Ocurrio un error al intentar actualizar el control de venta:` +error})
        }
    }
    static async deleteControlV(req:Request,res:Response){
        try {
            const id = parseInt(req.params.id as string);
            const respuesta = await ControlVService.deleteControlV(id);
            if(respuesta === true){
                return res.status(200).json({
                    status:"success",
                    message:"Se elimino correctamente el recurso",
                    result:respuesta
                })
            }
             return res.status(404).json({
                status:"Not Found",
                message:"No se encontro el control de venta",
                result:respuesta
            })
        } catch (error) {
            res.status(500).json({ error: "Ocurrio un erro al intentar Eliminar el control de venta:"+ error});
            
        }
    }
}