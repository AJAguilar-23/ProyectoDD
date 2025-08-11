import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js'; // Middleware para proteger rutas privadas
import { checkAuthor } from '../middlewares/checkAuthor.js'; // Middleware para verificar propiedad

// Importacion de controladores de publicaciones
import {
    getAllPublic,
    getById,
    createPublic,
    updatePublic,
    deletePublic
} from '../controllers/publicaciones.controller.js'; 

// Importacion de controladores de comentarios 
import {
     getComent,
    createComent
} from '../controllers/comentarios.controller.js';

const publicacionesRouter = Router();

// --- Endpoints de Publicaciones ---

// GET /api/publicaciones: Listar todas las publicaciones con paginación
publicacionesRouter.get('/', getAllPublic);

// GET /api/publicaciones/:id: Ver una publicación específica
publicacionesRouter.get('/:id', getById);

// POST /api/publicaciones: Crear una nueva publicación
// Requiere que el usuario esté autenticado.
publicacionesRouter.post('/', verifyToken, createPublic);

// PUT /api/publicaciones/:id: Editar publicación (solo el autor)
// Requiere autenticación y verificar la propiedad.
publicacionesRouter.put('/:id', verifyToken, checkAuthor, updatePublic);

// DELETE /api/publicaciones/:id: Eliminar publicación (solo el autor)
// Requiere autenticación y verificar la propiedad.
publicacionesRouter.delete('/:id', verifyToken, checkAuthor, deletePublic);

// --- Endpoints de Comentarios (anidados bajo publicaciones) ---

// GET /api/publicaciones/:id/comentarios: Ver todos los comentarios de una publicación
publicacionesRouter.get('/:id/comentarios',  getComent);

// POST /api/publicaciones/:id/comentarios: Comentar en una publicación
// Requiere que el usuario esté autenticado.
publicacionesRouter.post('/:id/comentarios', verifyToken, createComent);

export default publicacionesRouter;