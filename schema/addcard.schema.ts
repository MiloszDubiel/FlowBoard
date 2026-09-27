import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany").max(100),
  description: z.string().min(1, "Podaj opis").max(2000),
  dueDate: z
    .string()
    .regex(
      /^(000[1-9]|00[1-9]\d|0[1-9]\d\d|100\d|10[1-9]\d|1[1-9]\d{2}|[2-9]\d{3}|[1-9]\d{4}|1\d{5}|2[0-6]\d{4}|27[0-4]\d{3}|275[0-6]\d{2}|2757[0-5]\d|275760)-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])T(0\d|1\d|2[0-4]):(0\d|[1-5]\d)(?::(0\d|[1-5]\d))?(?:.(00\d|0[1-9]\d|[1-9]\d{2}))?$/,
      { error: "Niepoprawna data" },
    ),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

  userIds: z.array(z.number()),
});

export type CreateCardForm = z.infer<typeof createCardSchema>;
