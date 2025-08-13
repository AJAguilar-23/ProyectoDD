import { v4 as uuidv4 } from 'uuid';

// Importar funciones del modelo
import {
    getComentariosByPublicacion,
    createComentario
} from '../models/comentarios.js';
import { validateComentario } from "../schemas/comentario.schema.js";

// Función para sanitizar contenido y prevenir XSS 
function sanitizeInput(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

/**
 * @route GET /api/publicaciones/:id/comentarios
 * @description Obtiene todos los comentarios para una publicación específica.
 * @access Pública
 */
export const getComent = async (req, res) => {
    const { id: publicacionId } = req.params;

    try {
        const comentarios = await getComentariosByPublicacion(publicacionId);

        res.status(200).json({
            success: true,
            message: `Comentarios para la publicación ${publicacionId} obtenidos correctamente.`,
            data: comentarios
        });
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener los comentarios.',
            error: error.message
        });
    }
};

/**
 * @route POST /api/publicaciones/:id/comentarios
 * @description Permite a un usuario autenticado comentar en una publicación.
 * @access Privada
 */
export const createComent = async (req, res) => {
    const { id: publicacionId } = req.params;
    const user_id = req.user.id;

    // validacion con Zod
    const parsed = validateComentario(req.body);
    if (!parsed.success) {
        const first = parsed.error.issues?.[0];
        return res.status(400).json({
        success: false,
        message: first?.message || "Datos inválidos",
        errors: parsed.error.issues,
        });
    }

    // sanitizar
    const sanitizedContent = sanitizeInput(parsed.data.contenido);
    const id = uuidv4();

    try {
        const nuevoComentario = {
            id,
            content: sanitizedContent,
            publicacion_id: publicacionId,
            user_id
        };
        await createComentario(nuevoComentario);

        res.status(201).json({
            success: true,
            message: 'Comentario creado exitosamente.',
            data: nuevoComentario
        });
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el comentario.',
            error: error.message
        });
    }
};
