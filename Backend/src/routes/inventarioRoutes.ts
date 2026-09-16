import { Router } from "express";
import { InventarioController } from "../Controllers/inventarioController";

const inventarioRouter = Router();

inventarioRouter.get(`/`, InventarioController.getAllInventario);
inventarioRouter.get(`/:id`, InventarioController.getInventarioById);
inventarioRouter.post(`/`, InventarioController.createInventario);
inventarioRouter.put(`/:id`, InventarioController.updateInventario);
inventarioRouter.delete(`/:id`, InventarioController.deleteInventario);

export default inventarioRouter;