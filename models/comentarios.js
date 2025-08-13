import pool from '../config/db.js'; 

/**
 * Obtiene todos los comentarios para una publicación específica.
 * @param {string} publicacionId El ID UUID de la publicación.
 * @returns {Array} Lista de comentarios.
 */
export const getComentariosByPublicacion = async (publicacionId) => {
    const query = `SELECT
                       BIN_TO_UUID(c.id) as id,
                       c.content,
                       BIN_TO_UUID(c.publicacion_id) as publicacion_id,
                       BIN_TO_UUID(c.user_id) as user_id,
                       u.name as user_name, -- Unir con users para obtener el nombre del usuario que comentó
                       c.created_at
                   FROM comentarios c
                   JOIN users u ON c.user_id = u.id
                   WHERE c.publicacion_id = UUID_TO_BIN(?)
                   ORDER BY c.created_at ASC;`; // Ordenar por fecha de creación ascendente
    const [results] = await pool.query(query, [publicacionId]);
    return results;
};

/**
 * Crea un nuevo comentario en una publicación.
 * @param {Object} comentario Los datos del comentario (id, content, publicacion_id, user_id).
 * @returns {Object} El comentario creado.
 */
export const createComentario = async (comentario) => {
    const query = `INSERT INTO comentarios
                   (id, content, publicacion_id, user_id)
                   VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?), UUID_TO_BIN(?));`;
    const { id, content, publicacion_id, user_id } = comentario;
    await pool.query(query, [id, content, publicacion_id, user_id]);
    return comentario; // Retorna el comentario insertado.
};