import { Router } from "express";
import { CitaController } from "../Controllers/citasController";

const citaRouter = Router();

citaRouter.get(`/`, CitaController.getAllCitas);
citaRouter.get(`/:id`, CitaController.getCitaById);
citaRouter.post(`/`, CitaController.createCita);
citaRouter.put(`/:id`, CitaController.updateCita);
citaRouter.delete(`/:id`, CitaController.deleteCita);

export default citaRouter; 