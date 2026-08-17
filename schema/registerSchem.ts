import { z } from "zod";

export const registerShema = z
  .object({
    email: z.email().trim().toLowerCase().min(1, "Podaj poprawny email"),
    password: z
      .string()
      .min(1, "Hasło musi zawierać minimum 8 znaków.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Hasło musi składać się ze specjalnego znaku, cyfry i wielkie litery",
      ),
    confirmPassword: z.string(),
  })
  .refine((fields) => fields.password === fields.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hasła są różne",
  });

export type RegisterTypes = z.input<typeof registerShema>;
