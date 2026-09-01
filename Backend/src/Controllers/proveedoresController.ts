import {Request,Response} from 'express';
import * as proveedoresService from '../Services/proveedoresService';

export class ProveedoresController{
    static async getAllProveedores(req:Request,res:Response){
        try {
            const proveedores = await proveedoresService.getAllProveedores();
            res.status(200).json(proveedores);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener proveedores' });
        }
    }
    static async getProveedorById(req:Request,res:Response){
        try {
            const id = parseInt(req.params.id as string);
            const proveedor = await proveedoresService.getProveedorById(id);
            if (proveedor) {
                res.status(200).json(proveedor);
            } else {
                res.status(404).json({ error: 'Proveedor no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener proveedor por ID' });
        }
    }
    static async createProveedor(req:Request,res:Response){
        try {
            const { nombreProveedor, RUC, telefonoProveedor } = req.body;
            if (!nombreProveedor || !RUC || !telefonoProveedor) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const nuevoProveedor = await proveedoresService.createProveedor({nombreProveedor, RUC, telefonoProveedor });
            res.status(201).json({
                status: 'success',
                message: 'Proveedor creado exitosamente',
                data: nuevoProveedor
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear proveedor' });
        }
    }
    static async updateProveedor(req:Request, res:Response){
        try {
            const id = parseInt(req.params.id as string);
            const{ nombreProveedor, RUC, telefonoProveedor}  = req.body;
            const proveedor = {nombreProveedor,RUC,telefonoProveedor};
            if (!nombreProveedor || !RUC || !telefonoProveedor) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            const actualizado = await proveedoresService.updateProveedor(id,proveedor)
            return  res.status(200).json({
                status: 'succes',
                message: 'Proveedor Actualizado Exitosamente',
                result: actualizado
            });            
        } catch (error) {
            res.status(500).json({error:'Error al intentar actualizar el proveedor en el Controlador'+error});
            
        }
    }
    static async deleteProveedor(req:Request,res:Response){
        try {
            const id = parseInt(req.params.id as string);
            const eliminado = await proveedoresService.deleteProveedor(id);
            if(eliminado === true){
                return res.status(200).json({
                status:'succes',
                message:'Proveedor Eliminado correctamente',
                result : eliminado
            })
            }
            return res.status(404).json({
                status:'Not Found',
                message:'No se encontro el Proveedor',
                result:eliminado
            });
        } catch (error) {
            res.status(500).json({error:'Error al intentar eliminar un proveedor en el controlador error: ' + error});
        }
    }
}
