import pool from '../config/db.js'

export const registrarUsuarioDB = async(usuario_id, nombre, correo, contrasena) => {
    try {
        const query = "INSERT INTO usuarios (usuario_id, nombre, correo, contrasena_hash) VALUES (UUID_TO_BIN(?), ?, ?, ?)";
        const [results] = await pool.query(query, [usuario_id, nombre, correo, contrasena])
        return results
    } catch(error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes("'usuarios.correo'")) {
                throw new Error("El correo ya está registrado");
            } 
            if (error.sqlMessage.includes("'usuarios.nombre'")) {
                throw new Error("El nombre ya está registrado");
            }
        }
    throw error;
    }
    
}

export const loginUsuarioDB = async (correo) => {
    const query = "SELECT BIN_TO_UUID(usuario_id) as usuario_id, nombre, correo, contrasena_hash FROM usuarios WHERE correo = ?" 
    const [results] = await pool.query(query, [correo])
    return results[0]
}