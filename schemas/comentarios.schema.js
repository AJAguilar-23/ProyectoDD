import zod from 'zod'
import { sanitizarEntrada } from '../utils/sanitizar.js'

const comentarioSchema = zod.object({
    "contenido": zod.string({error: "El contenido es obligatorio"})
    .min(1, "El comentario no puede estar vacio")
    .max(300, "El comentario no puede exceder los 300 caracteres")
    .transform(sanitizarEntrada)
}).strict()

export const validarComentario = (data) => {
    return comentarioSchema.safeParse(data)
}