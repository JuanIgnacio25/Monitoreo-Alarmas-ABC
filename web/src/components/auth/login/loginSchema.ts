import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(2, { message: "Usuario Invalido" }).max(50),
  password: z.string().min(2, { message: "Contraseña invalida" }).max(16),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;