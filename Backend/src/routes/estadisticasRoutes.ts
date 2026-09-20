import { EstadisticasController } from "../Controllers/estadisticasController";
import { Router } from "express";

const estadisticasRouter = Router();

estadisticasRouter.get('/',EstadisticasController.getEstadisticas);

export default estadisticasRouter;