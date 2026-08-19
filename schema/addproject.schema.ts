import { z } from "zod";

export const addProjectSchema = z.object({
  name: z.string().min(2, "Podaj nazwę projektu"),
  description: z.string().min(8, "Podaj opis"),
});

export type AddProjectType = z.input<typeof addProjectSchema>;
