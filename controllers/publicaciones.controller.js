import { v4 as uuidv4 } from 'uuid';
import { validatePubliCreate, validatePubliUpdate } from "../schemas/publicacion.schema.js";
// Funciones del modelo de publicaciones
import {
    getAllPublicaciones,
    getPublicacionById,
    createPublicacion,
    updatePublicacion,
    deletePublicacion
} from '../models/publicaciones.js'; 

/**
 * @route GET /api/publicaciones
 * @description Lista todas las publicaciones con paginación.
 * @access Pública
 */
export const getAllPublic = async (req, res) => {
    // Obtener parámetros de paginación de la consulta
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; // Calcular el offset para la consulta SQL

    try {
        const publicaciones = await getAllPublicaciones({ limit, offset });

        // Si la consulta es exitosa, devuelve las publicaciones
        res.status(200).json({
            success: true,
            message: 'Publicaciones obtenidas correctamente.',
            data: publicaciones,
            pagination: {
                page,
                limit,
                
            }
        });
    } catch (error) {
        console.error('Error al obtener todas las publicaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener las publicaciones.',
            error: error.message
        });
    }
};

/**
 * @route GET /api/publicaciones/:id
 * @description Obtiene una publicación específica por su ID.
 * @access Pública
 */
export const getById = async (req, res) => {
    const { id } = req.params; 

    try {
        const publicacion = await getPublicacionById(id); 

        if (!publicacion || publicacion.length === 0) { 
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Publicación obtenida correctamente.',
            data: publicacion[0] 
        });
    } catch (error) {
        console.error('Error al obtener la publicación por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener la publicación.',
            error: error.message
        });
    }
};

/**
 * @route POST /api/publicaciones
 * @description Crea una nueva publicación.
 * @access Privada (solo usuario autenticado)
 */
export const createPublic = async (req, res) => {
    const parsed = validatePubliCreate(req.body);

    if (!parsed.success) {
        const first = parsed.error.issues?.[0];
        return res.status(400).json({
        success: false,
        message: first?.message || "Datos inválidos",
        });
    }
    const { titulo, contenido} = parsed.data;

    const id = uuidv4();
    const author_id = req.user.id;

    const nueva = {
        id,
        title: titulo,
        content: contenido,
        author_id,
    };

    try {
        await createPublicacion(nueva);
        return res.status(201).json({
        success: true,
        message: "Publicación creada exitosamente.",
        data: nueva,
        });
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear la publicación.',
            error: error.message
        });
    }
};

/**
 * @route PUT /api/publicaciones/:id
 * @description Edita una publicación existente (solo el autor).
 * @access Privada (requiere autenticación y verificación de autoría)
 */
export const updatePublic = async (req, res) => {
    const { id } = req.params;

    // validar body con Zod (al menos un campo)
    const parsed = validatePublicacionUpdate(req.body);
    if (!parsed.success) {
        const first = parsed.error.issues?.[0];
        return res.status(400).json({
        success: false,
        message: first?.message || "Datos inválidos",
        });
    }
    const { titulo, contenido  } = parsed.data;

    try {
        const rows = await getPublicacionById(id);
        if (!rows || rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Publicación no encontrada.",
        });
        }
        const existing = rows[0];

        // aplica parches
        const updates = {
        title: titulo ?? existing.title,
        content: contenido ?? existing.content,
        };

        await updatePublicacion(id, updates, req.user.id);

        res.status(200).json({
        success: true,
        message: "Publicación actualizada exitosamente.",
        data: { id, title: updates.title, content: updates.content },
        });
    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la publicación.',
            error: error.message
        });
    }
};

/**
 * @route DELETE /api/publicaciones/:id
 * @description Elimina una publicación (solo el autor).
 * @access Privada (requiere autenticación y verificación de autoría)
 */
export const deletePublic = async (req, res) => {
    const { id } = req.params; 
    const author_id = req.user.id; 

    try {
        const result = await deletePublicacion(id, author_id); 

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se pudo eliminar la publicación.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Publicación eliminada correctamente',
            data: { id }
        });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar la publicación.',
            error: error.message
        });
    }
};

