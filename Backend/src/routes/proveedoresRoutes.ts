import { Router } from "express";
import { ProveedoresController } from "../Controllers/proveedoresController";

const proveedoresRouter = Router();

proveedoresRouter.get(`/`, ProveedoresController.getAllProveedores);
proveedoresRouter.get(`/:id`, ProveedoresController.getProveedorById);
proveedoresRouter.post(`/`, ProveedoresController.createProveedor);
proveedoresRouter.put(`/:id`,ProveedoresController.updateProveedor);
proveedoresRouter.delete(`/:id`,ProveedoresController.deleteProveedor);

export default proveedoresRouter;