import { z } from "zod";

export const addProjectSchema = z.object({
  name: z.string().min(2, "Podaj nazwę projektu"),

  description: z.string().min(8, "Podaj opis"),

  color: z
    .enum(
      [
        "BLUE",
        "PURPLE",
        "PINK",
        "RED",
        "ORANGE",
        "YELLOW",
        "GREEN",
        "TEAL",
        "CYAN",
        "SLATE",
      ],
      "Nie wybrano koloru",
    )
    .default("ORANGE"),
});

export type AddProjectType = z.input<typeof addProjectSchema>;
