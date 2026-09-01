import { Router } from "express";

import { VehiculoController } from "../Controllers/vehiculoController";

const vehiculoRouter = Router();

vehiculoRouter.get('/', VehiculoController.getAllVehiculos);

vehiculoRouter.get('/:id', VehiculoController.getVehiculoById);

vehiculoRouter.post('/', VehiculoController.createVehiculo);

vehiculoRouter.put('/:id', VehiculoController.updateVehiculo);

vehiculoRouter.delete('/:id', VehiculoController.deleteVehiculo);

export default vehiculoRouter;