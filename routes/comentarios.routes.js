import {Router} from 'express'
import {isAuth} from '../middlewares/isAuth.js'
import {
    mostrarComentarios,
    crearComentario
} from '../controllers/comentarios.controller.js'

const comentariosRoutes = Router({mergeParams: true})
comentariosRoutes.get('/', mostrarComentarios)
comentariosRoutes.post('/', isAuth, crearComentario)

export default comentariosRoutes