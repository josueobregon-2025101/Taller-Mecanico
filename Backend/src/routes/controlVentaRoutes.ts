import { ControlVController } from "../Controllers/controlVentaController";
import { Router } from "express";

const ControlVentaRouter = Router();

ControlVentaRouter.get(`/`,ControlVController.getAllControlVenta);
ControlVentaRouter.get(`/:id`,ControlVController.getControlVById);
ControlVentaRouter.post(`/`,ControlVController.createControlV);
ControlVentaRouter.put(`/:id`,ControlVController.updateControlVenta);
ControlVentaRouter.delete(`/:id`,ControlVController.deleteControlV);

export default ControlVentaRouter;