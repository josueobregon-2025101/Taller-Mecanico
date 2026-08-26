import { Router } from "express";

import { ClienteController } from "../Controllers/clienteController";

const clienteRouter = Router();

clienteRouter.get('/', ClienteController.getAllClientes);

clienteRouter.get('/:id', ClienteController.getClienteById);

clienteRouter.post('/', ClienteController.createCliente);

clienteRouter.put('/:id', ClienteController.updateCliente);

clienteRouter.delete('/:id', ClienteController.deleteCliente);

export default clienteRouter;