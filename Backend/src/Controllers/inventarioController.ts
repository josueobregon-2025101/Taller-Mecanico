import { Request, Response } from 'express';
import * as inventarioService from '../Services/inventarioService';

export class InventarioController {

    static async getAllInventario(req: Request, res: Response) {
        try {
            const inventario = await inventarioService.getAllInventario();
            res.status(200).json(inventario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener inventario' });
        }
    }

    static async getInventarioById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const inventario = await inventarioService.getInventarioById(id);

            if (inventario) {
                res.status(200).json(inventario);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener producto por ID' });
        }
    }

    static async createInventario(req: Request, res: Response) {
        try {

            const {nombre,descripcion,marca,categoria,stock_actual,precio_compra,precio_venta,idProveedor} = req.body;

            if (!nombre ||!descripcion ||!marca ||!categoria ||stock_actual === undefined ||!precio_compra ||!precio_venta ||
                !idProveedor) {
                return res.status(400).json({
                    error: 'Faltan datos requeridos'
                });
            }
            const nuevoInventario = await inventarioService.createInventario({nombre,descripcion,marca,categoria,stock_actual,
                precio_compra,precio_venta,idProveedor});

            res.status(201).json({
                status: 'success',
                message: 'Producto creado exitosamente',
                data: nuevoInventario
            });

        } catch (error) {res.status(500).json({error: 'Error al crear producto en controller ' + error
            });
        }
    }

    static async updateInventario(req: Request, res: Response) {
        try {const id = parseInt(req.params.id as string);

            const { nombre,descripcion,marca,categoria,stock_actual,precio_compra,precio_venta, idProveedor} = req.body;
            const inventario = {nombre,descripcion,marca,categoria,stock_actual,precio_compra,precio_venta,
                idProveedor
            };

            const actualizado = await inventarioService.updateInventario(id,inventario);

            return res.status(200).json({
                status: 'succes',
                message: 'Producto actualizado exitosamente',
                result: actualizado
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al intentar actualizar producto en el controlador ' + error
            });
        }
    }

    static async deleteInventario(req: Request, res: Response) {
        try {

            const id = parseInt(req.params.id as string);

            const eliminado = await inventarioService.deleteInventario(id);

            if (eliminado === true) {
                return res.status(200).json({status: 'succes',
                    message: 'Producto eliminado exitosamente',
                    result: eliminado
                });
            }

            return res.status(404).json({ status: 'Not Found',
            message: 'No se encontro el producto',
                result: eliminado
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al intentar eliminar producto en el controlador ' + error
            });
        }
    }
}