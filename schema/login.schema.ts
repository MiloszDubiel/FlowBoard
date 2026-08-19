import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ error: "Niepoprawny adres email" })
    .trim()
    .toLowerCase()
    .min(1, "Podaj poprawny email"),
  password: z.string().min(1, "Hasło musi zawierać minimum 8 znaków."),
});

export type LoginTypes = z.input<typeof loginSchema>;
