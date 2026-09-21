import { Router } from 'express';
import { AuthController } from '../Controllers/authController';

const authRouter = Router();

authRouter.post('/register', AuthController.registrar);

authRouter.post('/login', AuthController.login);

export default authRouter;