import pool from '../config/db.js'

export const mostrarComentariosDB = async (id) => {
    const query = `
    SELECT u.nombre, c.contenido 
    FROM comentarios c
    INNER JOIN usuarios u ON c.usuario_id = u.usuario_id
    WHERE publicacion_id = ?
    ORDER BY c.fecha_hora
    `
    const [resultado] = await pool.query(query, [id])
    return resultado
}

export const crearComentarioDB = async (comentario_id, publicacion_id, usuario_id, contenido) => {
    const query = "INSERT INTO comentarios (comentario_id, publicacion_id, usuario_id, contenido) VALUES (?, ?, UUID_TO_BIN(?), ?)"
    const [resultado] = await pool.query(query, [comentario_id, publicacion_id, usuario_id, contenido])
    return resultado
}