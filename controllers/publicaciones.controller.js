import { v4 as uuidv4 } from 'uuid';
import {
    validarPublicacion
} from '../schemas/publicaciones.schema.js'
import {
    mostrarPublicacionesDB,
    buscarPublicacionDB,
    crearPublicacionDB,
    editarPublicacionDB,
    borrarPublicacionDB
} from '../models/publicaciones.model.js'


export const mostrarPublicaciones = async (req, res, next) => {
    try {
        const {pag} = req.query
        const limite = 5

        const offset = (pag - 1) * limite
        const datos = await mostrarPublicacionesDB(limite, offset)
        res.status(200).json(datos)
    } catch(error) {
        next(error)
    }
}

export const crearPublicacion = async (req, res, next) => {
    const data = req.body
    const usuario_id = req.params.usuario_id
    const publicacion_id = uuidv4()

    const { success, error: zodError, data: safeData } = validarPublicacion(data)
    if (!success) {
        const error = new Error(zodError.issues[0].message)
        error.statusCode = 400
        return next(error)
    }

    const datos = await crearPublicacionDB(publicacion_id, usuario_id, safeData.titulo, safeData.contenido)
    res.status(200).json({exito: true, message: "Publicacion creada exitosamente"})
}


export const mostrarPublicacion = async (req, res, next) => {
    const {id} = req.params

    const resultado = await buscarPublicacionDB(id)
    if (resultado === undefined) {
        const error = new Error("No se pudo encontrar la publicacion")
        error.statusCode = 404
        return next(error)
    }
    delete resultado.usuario_id
    res.status(200).json(resultado)
}

export const editarPublicacion = async (req, res, next) => {
    const {id} = req.params
    const data = req.body

    const existePublicacion = await buscarPublicacionDB(id)
    if (existePublicacion === undefined) {
        const error = new Error("No se pudo encontrar la publicacion")
        error.statusCode = 404
        return next(error)
    }

    const { success, error: zodError, data: safeData } = validarPublicacion(data)
        if (!success) {
            const error = new Error(zodError.issues[0].message)
            error.statusCode = 400
            return next(error)
        }

    if (existePublicacion.usuario_id != req.params.usuario_id) {
        const error = new Error("No tiene permisos para editar esta publicacion")
        error.statusCode = 403
        return next(error)
    }
    
    const resultado = await editarPublicacionDB(id, safeData.titulo, safeData.contenido)

    res.status(200).json({exito: true, message: "Publicacion editada exitosamente"})
}

export const borrarPublicacion = async (req, res, next) => {
    const {id} = req.params

    const existePublicacion = await buscarPublicacionDB(id)
    if (existePublicacion === undefined) {
        const error = new Error("No se pudo encontrar la publicacion")
        error.statusCode = 404
        return next(error)
    }

    if (existePublicacion.usuario_id != req.params.usuario_id) {
        const error = new Error("No tiene permisos para editar esta publicacion")
        error.statusCode = 403
        return next(error)
    }
    
    const resultado = await borrarPublicacionDB(id)
    res.status(200).json({exito: true, message: "Publicacion borrada exitosamente"})
}