import { Router } from "express";
import { DetalleServicioController } from "../Controllers/detalleServicioController";

const detalleServicioRouter = Router();

detalleServicioRouter.get(`/`, DetalleServicioController.getAllDetalleServicios);
detalleServicioRouter.get(`/:id`, DetalleServicioController.getDetalleServicioById);
detalleServicioRouter.post(`/`, DetalleServicioController.createDetalleServicio);
detalleServicioRouter.put(`/:id`, DetalleServicioController.updateDetalleServicio);
detalleServicioRouter.delete(`/:id`, DetalleServicioController.deleteDetalleServicio);

export default detalleServicioRouter;