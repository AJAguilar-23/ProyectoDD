import pool from '../config/db.js'; 

/**
 * Función para obtener un usuario por su correo electrónico para el inicio de sesión.
 * @param {string} email El correo electrónico del usuario.
 * @returns {Object|undefined} El registro del usuario o undefined si no se encuentra.
 */
export const loginUser = async (email) => {
    const query = `SELECT BIN_TO_UUID(id) as id, name, email, phone, must_change_password, password_hash, created_at
                   FROM users
                   WHERE email = ?`;
    const [results] = await pool.query(query, [email]);
    return results; // Retorna el primer resultado.
};

/**
 * Función para registrar un nuevo usuario.
 * @param {Object} user Datos del usuario a registrar (id, name, email, phone, password_hash).
 * @returns {Object} Resultado de la operación de inserción.
 */
export const register = async (user) => {
    const query = `INSERT INTO users (id, name, email, phone, password_hash, must_change_password)
                   VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, 1)`;
    const [rows] = await pool.query(query, [user.id, user.name, user.email, user.phone, user.password_hash]);
    return rows;
};

/**
 * Función para actualizar la contraseña de un usuario.
 * @param {string} id El ID UUID del usuario.
 * @param {string} password_hash El nuevo hash de la contraseña.
 * @returns {Object} Resultado de la operación de actualización.
 */
export const updatePassword = async (id, password_hash) => {
    const query = `UPDATE users
                   SET password_hash = ?, must_change_password = 0
                   WHERE id = UUID_TO_BIN(?)`;
    const [rows] = await pool.query(query, [password_hash, id]);
    return rows;
};