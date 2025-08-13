export const manejadorErrores = (err, req, res, next) => {
    const codigoError = err.statusCode || 500
    const mensaje = err.message || "Error interno del servidor"

    res.status(codigoError).json({exito: false, message: mensaje})
}

export default manejadorErrores