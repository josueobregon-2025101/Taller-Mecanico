import { Router } from "express";
import { MovInventarioController } from "../Controllers/MovInventarioController";

const movInventarioRouter = Router();

movInventarioRouter.get(`/`, MovInventarioController.getAllMovInventario);
movInventarioRouter.get(`/:id`, MovInventarioController.getMovInventarioById);
movInventarioRouter.post(`/`, MovInventarioController.createMovInventario);
movInventarioRouter.put(`/:id`,MovInventarioController.updateMovInventario);
movInventarioRouter.delete(`/:id`,MovInventarioController.deleteMovInventario);

export default movInventarioRouter;