import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany").max(100),
  description: z.string().min(1, "Podaj opis").max(2000),
  dueDate: z.string().datetime({ local: true, error: "Niepoprawna data" }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  userIds: z.array(z.number()).min(1, "Wybierz użytkownika/ów"),
});

export type CreateCardForm = z.infer<typeof createCardSchema>;
