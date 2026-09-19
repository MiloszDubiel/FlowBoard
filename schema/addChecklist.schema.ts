import { z } from "zod";
export const checklistSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().min(1, "Tytuł zadania nie może być pusty"),
      isCompleted: z.boolean(),
    }),
  ),
});

export type ChecklistType = z.infer<typeof checklistSchema>;
