import { Request,Response } from "express";
import * as MovInventarioService from "../Services/movInventarioService"

export class MovInventarioController{
    static async getAllMovInventario(req:Request,res:Response){
            try {
                const mov = await MovInventarioService.getAllMovInventario();
                res.status(200).json(mov);
            } catch (error) {
                res.status(500).json({ error: 'Error al obtener Movimientos' });
            }
        }
        static async getMovInventarioById(req:Request,res:Response){
            try {
                const id = parseInt(req.params.id as string);
                const mov = await MovInventarioService.getMovInventarioById(id);
                if (mov) {
                    res.status(200).json(mov);
                } else {
                    res.status(404).json({ error: 'Movimiento de Inventario no encontrado' });
                }
         
            } catch (error) {
                res.status(500).json({ error: 'Error al obtener Movimiento inventario por ID' });
            }
        }
        static async createMovInventario(req:Request,res:Response){
            try {
                const { idInventario, movimientos, cantidad,fechahora, motivo, idServicio } = req.body;
                if (!idInventario || !movimientos || !cantidad ||!fechahora || !motivo || !idServicio) {
                    return res.status(400).json({ error: 'Faltan datos requeridos' });
                }
                const nuevoMovimiento = await MovInventarioService.createMovInventario({idInventario, movimientos, cantidad,fechahora, motivo, idServicio });
                res.status(201).json({
                    status: 'success',
                    message: 'Movimiento en el Inventario creado exitosamente',
                    data: nuevoMovimiento
                });
            } catch (error) {
                res.status(500).json({ error: 'Error al crear Movimiento inventario en controller' + error });
            }
        }
        static async updateMovInventario(req:Request, res:Response){
            try {
                const id = parseInt(req.params.id as string);
                const{ idInventario, movimientos, cantidad,fechahora, motivo, idServicio }  = req.body;
                const movInventario = {idInventario, movimientos, cantidad,fechahora, motivo, idServicio };
                if (!idInventario || !movimientos || !cantidad ||!fechahora || !motivo || !idServicio) {
                    return res.status(400).json({ error: 'Faltan datos requeridos' });
                }
                const actualizado = await MovInventarioService.updateMovInventario(id,movInventario)
                return  res.status(200).json({
                    status: 'succes',
                    message: 'Movimiento Actualizado Exitosamente',
                    result: actualizado
                });            
            } catch (error) {
                res.status(500).json({error:'Error al intentar actualizar el movimiento en el Controlador'+error});
                
            }
        }
        static async deleteMovInventario(req:Request,res:Response){
            try {
                const id = parseInt(req.params.id as string);
                const eliminado = await MovInventarioService.deleteMovInventario(id);
                if(eliminado === true){
                    return res.status(200).json({
                    status:'succes',
                    message:'Movimiento Inventario Eliminado correctamente',
                    result : eliminado
                })
                }
                return res.status(404).json({
                    status:'Not Found',
                    message:'No se encontro el Proveedor',
                    result:eliminado
                });
            } catch (error) {
                res.status(500).json({error:'Error al intentar eliminar un Movimiento Inventario en el controlador error: ' + error});
            }
        }
}