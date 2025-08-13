import zod from 'zod'


const registroSchema = zod.object({
    "nombre": zod.string({error: "El nombre de usuario es obligatorio"})
    .min(3, {error: "El nombre de usuario debe tener al menos 3 caracteres"})
    .max(20, {error: "El nombre no puede tener mas de 20 caracteres"})
    .refine((val) => {return /^[a-zA-Z0-9_.-]+$/.test(val)}, {error: "El nombre de usuario solo puede contener letras, números, guion bajo, punto y guion medio"}),

    "correo": zod.email({error: "El correo no es valido"})
    .max(254, {error: "El correo no puede exceder 254 caracteres"}),

    "contrasena": zod.string({error: "La contraseña es obligatoria"})
    .min(8, {error: "La contraseña debe tener al menos 8 caracteres"})
    .max(64, {error: "La contraseña no puede tener mas de 64 caracteres"})
    }).strict()

export const validarRegistro = (usuario) => {
    return registroSchema.safeParse(usuario)
}

const loginSchema = zod.object({
    "correo": zod.email({error: "El correo no es valido"})
    .max(254, {error: "El correo no puede exceder 254 caracteres"}),
    
    "contrasena": zod.string({error: "La contraseña es obligatoria"})
    .min(8, {error: "La contraseña debe tener al menos 8 caracteres"})
    .max(64, {error: "La contraseña no puede tener mas de 64 caracteres"})
}).strict()

export const validarLogin = (usuario) => {
    return loginSchema.safeParse(usuario)
}