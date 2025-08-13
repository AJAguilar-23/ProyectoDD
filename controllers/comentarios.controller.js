import { v4 as uuidv4 } from 'uuid';
import { buscarPublicacionDB } from "../models/publicaciones.model.js"
import { crearComentarioDB, mostrarComentariosDB } from '../models/comentarios.model.js';
import { validarComentario } from '../schemas/comentarios.schema.js';

export const mostrarComentarios = async (req, res, next) => {
    const {id} = req.params

    const existePublicacion = await buscarPublicacionDB(id)
        if (existePublicacion === undefined) {
            const error = new Error("No se pudo encontrar la publicacion")
            error.statusCode = 404
            return next(error)
        }

    const resultado = await mostrarComentariosDB(id)
    res.status(200).json(resultado)
}

export const crearComentario = async(req, res, next) => {
    const {id: publicacion_id} = req.params
    const comentario_id = uuidv4()
    const usuario_id = req.params.usuario_id

    const data = req.body

    const existePublicacion = await buscarPublicacionDB(publicacion_id)
        if (existePublicacion === undefined) {
            const error = new Error("No se pudo encontrar la publicacion")
            error.statusCode = 404
            return next(error)
        }

    const { success, error: zodError, data: safeData } = validarComentario(data)
            if (!success) {
                const error = new Error(zodError.issues[0].message)
                error.statusCode = 400
                return next(error)
            }
    
    const resultado = await crearComentarioDB(comentario_id, publicacion_id, usuario_id, safeData.contenido)
    res.status(200).json({exito: true, message: "Comentario publicado exitosamente"})
}