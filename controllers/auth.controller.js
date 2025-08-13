import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import {validarRegistro, validarLogin} from '../schemas/auth.schema.js'

import {registrarUsuarioDB, loginUsuarioDB} from '../models/auth.model.js'

export const registrarUsuario = async(req, res, next) => {
    const usuario_id = uuidv4()
    const data = req.body

    const { success, error: zodError, data: safeData } = validarRegistro(data)

    if (!success) {
        const error = new Error(zodError.issues[0].message)
        error.statusCode = 400
        return next(error)
    }
   
    const {nombre, correo, contrasena} = safeData
    const contrasena_hash = await bcrypt.hash(contrasena, 12)


    try {
        const resultado = await registrarUsuarioDB(usuario_id, nombre, correo, contrasena_hash)
        res.status(201).json({exito: true, mensaje: "Usuario creado con exito"})
    }
    catch(sqlError) {
        const error = new Error(sqlError.message)
        error.statusCode = 409
        return next(error)
    }
}

export const loginUsuario = async (req, res, next) => {
    const data = req.body

    const { success, error: zodError, data: safeData } = validarLogin(data)

    if (!success) {
        const error = new Error(zodError.issues[0].message)
        error.statusCode = 400
        return next(error)
    }

    const {correo, contrasena} = safeData
    const resultado = await loginUsuarioDB(correo)

    if (resultado === undefined) {
        const error = new Error("Correo o contraseña incorrectos")
        error.statusCode = 401
        return next(error)
    }
    if (!await bcrypt.compare(contrasena, resultado.contrasena_hash)) {
        const error = new Error("Correo o contraseña incorrectos")
        error.statusCode = 401
        return next(error)
    }

    const payload = {
        usuario_id: resultado.usuario_id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256', 
        expiresIn: '12h'
    })

    res.status(201).json({
        exito: true,
        mensaje: "Usuario autenticado con exito",
        token
    })
}