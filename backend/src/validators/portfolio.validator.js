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

  coverImage: z.string().optional(),

  techStack: z.array(z.string()).default([]),

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

  featured: z.boolean().optional(),

  order: z.number().optional(),
});

export const updatePortfolioSchema =
  createPortfolioSchema.partial();