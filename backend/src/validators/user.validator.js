import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(250, "Bio cannot exceed 250 characters")
    .optional()
    .or(z.literal("")),
  skills: z
    .array(z.string())
    .optional(),
  github: z
    .string()
    .url("Please provide a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Please provide a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please provide a valid website URL")
    .optional()
    .or(z.literal("")),
});
