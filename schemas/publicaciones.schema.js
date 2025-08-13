import zod from 'zod'
import {sanitizarEntrada} from '../utils/sanitizar.js'

const publicacionSchema = zod.object({
    "titulo": zod.string({error: "El titulo es obligatorio"})
    .min(1, {error: "El titulo no puede estar vacio"})
    .max(60, {error: "El titulo no puede ser mayor de 60 caracteres"})
    .transform(sanitizarEntrada),

    "contenido": zod.string({error: "El contenido es obligatorio"})
    .min(1, {error: "El contenido no puede estar vacio"})
    .max(1000, {error: "El contenido no puede ser mayor de 1000 caracteres"})
    .transform(sanitizarEntrada),
}).strict()

export const validarPublicacion = (data) => {
    return publicacionSchema.safeParse(data)
}