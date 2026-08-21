import { z } from "zod";

export const addListSchema = z.object({
  name: z.string().min(4, "Podaj nazwę listy"),
});

export type AddListType = z.input<typeof addListSchema>;
