import { z } from "zod";

const comentarioSchema = z.object({
  contenido: z.string({ message: "El contenido debe ser texto" })
              .trim()
              .min(1, "El contenido no puede estar vacío")
              .max(1000, "Máximo 1000 caracteres"),
}).strict();

export const validateComentario = (data) => comentarioSchema.safeParse(data);
