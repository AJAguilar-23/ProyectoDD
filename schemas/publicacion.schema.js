import { z } from "zod";

const publicacionCreateSchema = z.object({
  titulo: z.string({ message: "El título debe ser texto" })
           .trim()
           .min(1, "El título no puede estar vacío")
           .max(200, "Máximo 200 caracteres"),
  contenido: z.string({ message: "El contenido debe ser texto" })
              .trim()
              .min(1, "El contenido no puede estar vacío"),
}).strict();

const publicacionUpdateSchema = z.object({
  titulo: z.string().trim().min(1,"El título no puede estar vacío").max(200,"Máximo 200 caracteres").optional(),
  contenido: z.string({ message: "El contenido debe ser texto" }).trim().min(1,"El contenido no puede estar vacío").optional(),
})
.refine((data) => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar",
});

export const validatePubliCreate = (data) => publicacionCreateSchema.safeParse(data);
export const validatePubliUpdate = (data) => publicacionUpdateSchema.safeParse(data);
