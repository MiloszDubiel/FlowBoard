import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany").max(100),
  description: z.string().max(2000).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  userIds: z.array(z.number()),
});

export type CreateCardForm = z.infer<typeof createCardSchema>;
