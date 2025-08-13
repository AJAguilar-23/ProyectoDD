
import jwt from 'jsonwebtoken'

export const isAuth = (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Debe iniciar sesión para acceder a este recurso',
        })
    }

    const token = authorization.split(' ')[1]

    try {

        const {usuario_id} = jwt.verify(token, process.env.JWT_SECRET)
        req.params.usuario_id = usuario_id
        next()
        
    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Debe iniciar sesión para acceder a este recurso',
        })
    }
}