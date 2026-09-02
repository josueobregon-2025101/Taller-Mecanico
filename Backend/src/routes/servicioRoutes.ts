import { Router } from "express";
import { ServicioController } from "../Controllers/servicioController";

const servicioRouter = Router();

servicioRouter.get(`/`, ServicioController.getAllServicios);
servicioRouter.get(`/:id`, ServicioController.getServicioById);
servicioRouter.post(`/`, ServicioController.createServicio);
servicioRouter.put(`/:id`, ServicioController.updateServicio);
servicioRouter.delete(`/:id`, ServicioController.deleteServicio);

export default servicioRouter;
