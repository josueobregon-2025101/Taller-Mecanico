import { Router } from "express";
import { ProveedoresController } from "../Controllers/proveedoresController";

const proveedoresRouter = Router();

proveedoresRouter.get('/', ProveedoresController.getAllProveedores);
proveedoresRouter.get('/:id', ProveedoresController.getProveedorById);
proveedoresRouter.post('/', ProveedoresController.createProveedor);

export default proveedoresRouter;