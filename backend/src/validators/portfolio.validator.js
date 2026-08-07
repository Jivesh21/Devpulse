import { z } from "zod";

export const createPortfolioSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500),

  coverImage: z.any().optional(),

  techStack: z
    .union([
      z.array(z.string()),
      z.string(),
    ])
    .optional()
    .transform((value) => {
      if (!value) return [];

      if (Array.isArray(value)) {
        return value;
      }

      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }),

  githubUrl: z
    .string()
    .url("Invalid GitHub URL")
    .optional()
    .or(z.literal("")),

  liveUrl: z
    .string()
    .url("Invalid Live URL")
    .optional()
    .or(z.literal("")),

  featured: z
    .union([
      z.boolean(),
      z.string(),
    ])
    .optional()
    .transform((value) => {
      if (value === true || value === "true")
        return true;

      return false;
    }),

  order: z
    .union([
      z.number(),
      z.string(),
    ])
    .optional()
    .transform((value) => {
      if (value === undefined)
        return 0;

      return Number(value);
    }),
});

export const updatePortfolioSchema =
  createPortfolioSchema.partial();