import pool from '../config/db.js';

export const checkAuthor = async (req, res, next) => {
    // Obtener el ID de la publicación de los parámetros de la ruta
    const publicacionId = req.params.id; 

    // Obtener el ID del usuario del token 
    const userIdFromToken = req.user.id; 

    if (!publicacionId || !userIdFromToken) {
        return res.status(400).json({
            success: false,
            message: 'ID de publicación o ID de usuario no disponible para la verificación de autoría.'
        });
    }

    try {
        // Consultar la base de datos para obtener el author_id de la publicación
        const query = `SELECT BIN_TO_UUID(author_id) as author_id
                       FROM publicaciones
                       WHERE id = UUID_TO_BIN(?)`;
        const [results] = await pool.query(query, [publicacionId]);

        // Verificar si la publicación existe
        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada.'
            });
        }

        const authorIdFromDb = results[0].author_id;

        // Comparar el ID del usuario del token con el author_id de la publicación
        if (userIdFromToken === authorIdFromDb) {
            // Si coinciden se permite continuar
            next();
        } else {
            // Si no coinciden, denegar el acceso
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo el autor puede editar o eliminar esta publicación.'
            });
        }
    } catch (error) {
        console.error('Error al verificar la autoría:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al verificar la autoría.'
        });
    }
};