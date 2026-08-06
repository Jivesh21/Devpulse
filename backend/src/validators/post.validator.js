import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .max(5000, "Post content cannot exceed 5000 characters")
    .optional(),
});
