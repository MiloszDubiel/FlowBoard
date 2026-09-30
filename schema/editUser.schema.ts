import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "Podaj imię."),
  lastName: z.string().min(1, "Podaj nazwisko."),
  bio: z.string().nullable(),
});

export type ProfileTypes = z.input<typeof profileSchema>;

export const securitySchema = z
  .object({
    password: z
      .string()
      .min(8, "Hasło musi zawierać minimum 8 znaków.")
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

export type SecurityTypes = z.input<typeof securitySchema>;

export const accountSchema = z.object({
  email: z
    .email({ error: "Niepoprawny adres email" })
    .trim()
    .toLowerCase()
    .min(1, "Podaj poprawny email"),
});

export type AccountTypes = z.input<typeof accountSchema>;
