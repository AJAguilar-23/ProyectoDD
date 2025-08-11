import { Router } from 'express';
// Controlador de autenticación
import { createUser, login, setPassword } from '../controllers/auth.controller.js'; 

const authRouter = Router();

// POST /api/auth/register: Registro de usuario
authRouter.post('/register', createUser); 

// POST /api/auth/login: Inicio de sesión
authRouter.post('/login', login); 

// PATCH /api/auth/set-password: Cambio de contraseña 
authRouter.patch('/set-password', setPassword); 

export default authRouter;