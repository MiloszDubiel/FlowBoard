import { z } from "zod";
export const commentSchema = z.object({
  comment: z.string().min(1, "Komentarz nie może być pusty"),
});

export type CommentType = z.infer<typeof commentSchema>;
