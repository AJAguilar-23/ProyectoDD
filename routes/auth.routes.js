import {Router} from 'express'
import {registrarUsuario, loginUsuario} from '../controllers/auth.controller.js'

const authRouter = Router()

authRouter.post('/register', registrarUsuario)
authRouter.post('/login', loginUsuario)

export default authRouter