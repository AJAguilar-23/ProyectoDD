import {Router} from 'express'
import {
    crearPublicacion,
    mostrarPublicaciones,
    mostrarPublicacion,
    editarPublicacion,
    borrarPublicacion
} from '../controllers/publicaciones.controller.js'
import {isAuth} from '../middlewares/isAuth.js'

const publicacionesRoutes = Router()

publicacionesRoutes.post('/', isAuth, crearPublicacion)
publicacionesRoutes.get('/', mostrarPublicaciones)
publicacionesRoutes.get('/:id', mostrarPublicacion)
publicacionesRoutes.put('/:id', isAuth, editarPublicacion)
publicacionesRoutes.delete('/:id', isAuth, borrarPublicacion)

export default publicacionesRoutes