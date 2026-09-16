import { Router } from "express";
import { EmpleadoController } from "../Controllers/empleadosController";

const empleadoRouter = Router();

empleadoRouter.get(`/`, EmpleadoController.getAllEmpleados);
empleadoRouter.get(`/:id`, EmpleadoController.getEmpleadoById);
empleadoRouter.post(`/`, EmpleadoController.createEmpleado);
empleadoRouter.put(`/:id`, EmpleadoController.updateEmpleado);
empleadoRouter.delete(`/:id`, EmpleadoController.deleteEmpleado);

export default empleadoRouter;