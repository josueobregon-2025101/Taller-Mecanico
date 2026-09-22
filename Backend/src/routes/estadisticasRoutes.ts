import { Router } from 'express';
import {EstadisticasController} from '../Controllers/estadisticasController';

const estadisticasRouter = Router();

estadisticasRouter.get(
    '/',
    EstadisticasController.getEstadisticas
);

estadisticasRouter.get(
    '/actividad-reciente',
    EstadisticasController.getActividadReciente
);

export default estadisticasRouter;