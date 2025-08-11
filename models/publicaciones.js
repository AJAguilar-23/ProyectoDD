import pool from '../config/db.js'; 

/**
 * Obtiene todas las publicaciones, con soporte para paginación.
 * @param {Object} options Opciones de consulta (ej. { limit, offset }).
 * @returns {Array} Lista de publicaciones.
 */
export const getAllPublicaciones = async ({ limit, offset }) => {
    const query = `SELECT
                       BIN_TO_UUID(p.id) as id,
                       p.title,
                       p.content,
                       BIN_TO_UUID(p.author_id) as author_id,
                       u.name as author_name, -- Unir con users para obtener el nombre del autor
                       p.created_at,
                       p.updated_at
                   FROM publicaciones p
                   JOIN users u ON p.author_id = u.id
                   ORDER BY p.created_at DESC -- Ordenar por fecha de creación descendente
                   LIMIT ? OFFSET ?;`;
    const [results] = await pool.query(query, [limit, offset]);
    return results;
};

/**
 * Obtiene una publicación específica por su ID.
 * @param {string} id El ID UUID de la publicación.
 * @returns {Object|undefined} La publicación o undefined si no se encuentra.
 */
export const getPublicacionById = async (id) => {
    const query = `SELECT
                       BIN_TO_UUID(p.id) as id,
                       p.title,
                       p.content,
                       BIN_TO_UUID(p.author_id) as author_id,
                       u.name as author_name, -- Unir con users para obtener el nombre del autor
                       p.created_at,
                       p.updated_at
                   FROM publicaciones p
                   JOIN users u ON p.author_id = u.id
                   WHERE p.id = UUID_TO_BIN(?);`; // UUID_TO_BIN para la comparación de ID
    const [data] = await pool.query(query, [id]);
    return data;
};

/**
 * Crea una nueva publicación.
 * @param {Object} publicacion Los datos de la publicación (id, title, content, author_id).
 * @returns {Object} La publicación creada.
 */
export const createPublicacion = async (publicacion) => {
    const query = `INSERT INTO publicaciones
                   (id, title, content, author_id)
                   VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?));`;
    const { id, title, content, author_id } = publicacion;
    await pool.query(query, [id, title, content, author_id]);
    return publicacion; // Retorna la publicación insertada .
};

/**
 * Actualiza una publicación existente.
 * @param {string} id El ID UUID de la publicación a actualizar.
 * @param {Object} updates Los campos a actualizar (title, content).
 * @param {string} authorId El ID UUID del autor para verificar la propiedad.
 * @returns {Object} Resultado de la operación de actualización.
 */
export const updatePublicacion = async (id, updates, authorId) => {
    const query = `UPDATE publicaciones
                   SET title = ?, content = ?
                   WHERE id = UUID_TO_BIN(?) AND author_id = UUID_TO_BIN(?);`; // Verificar propiedad por author_id
    const [rows] = await pool.query(query, [updates.title, updates.content, id, authorId]);
    return rows; // Retorna información sobre las filas afectadas.
};

/**
 * Elimina una publicación.
 * @param {string} id El ID UUID de la publicación a eliminar.
 * @param {string} authorId El ID UUID del autor para verificar la propiedad.
 * @returns {Object} Resultado de la operación de eliminación.
 */
export const deletePublicacion = async (id, authorId) => {
    const query = `DELETE FROM publicaciones
                   WHERE id = UUID_TO_BIN(?) AND author_id = UUID_TO_BIN(?);`; // Verificar propiedad por author_id
    const [rows] = await pool.query(query, [id, authorId]);
    return rows; // Retorna información sobre las filas afectadas.
};