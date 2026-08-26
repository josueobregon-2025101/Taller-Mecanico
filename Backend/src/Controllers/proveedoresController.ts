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
}
