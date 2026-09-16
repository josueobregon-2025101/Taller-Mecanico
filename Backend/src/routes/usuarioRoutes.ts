import { Router } from "express";
import { UsuarioController } from "../Controllers/usuarioController";

const usuarioRouter = Router();

usuarioRouter.get(`/`, UsuarioController.getAllUsuarios);
usuarioRouter.get(`/:id`, UsuarioController.getUsuarioById);
usuarioRouter.post(`/`, UsuarioController.createUsuario);
usuarioRouter.put(`/:id`, UsuarioController.updateUsuario);
usuarioRouter.delete(`/:id`, UsuarioController.deleteUsuario);

export default usuarioRouter;