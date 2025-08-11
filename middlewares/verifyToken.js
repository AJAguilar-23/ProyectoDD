import jwt from 'jsonwebtoken'; 

export const verifyToken = (req, res, next) => {
    // Obtener el encabezado de autorización
    const { authorization } = req.headers;

    // Verificar si el encabezado de autorización existe
    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: 'Debe iniciar sesión para acceder a este recurso. No se proporcionó token.'
        });
    }
    // Extraer el token (formato "Bearer TOKEN")
    const token = authorization.split(' ')[1];

    // Validar el token JWT
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 

        // Continuar con la ejecucion
        next();
    } catch (error) {
        // Manejo de errores para tokens inválidos o expirados
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado. Debe iniciar sesión nuevamente.'
        });
    }
};
