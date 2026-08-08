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
  experience: z.array(z.object({
    company: z.string().trim().max(100).optional(),
    position: z.string().trim().max(100).optional(),
    employmentType: z.string().trim().max(50).optional(),
    location: z.string().trim().max(100).optional(),
    currentlyWorking: z.boolean().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().trim().max(1000).optional(),
  })).optional(),
  education: z.array(z.object({
    institution: z.string().trim().max(150).optional(),
    degree: z.string().trim().max(100).optional(),
    fieldOfStudy: z.string().trim().max(100).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    grade: z.string().trim().max(50).optional(),
    description: z.string().trim().max(1000).optional(),
  })).optional(),
  certificates: z.array(z.object({
    title: z.string().trim().max(150).optional(),
    issuer: z.string().trim().max(100).optional(),
    issueDate: z.string().optional(),
    credentialUrl: z.string().url().optional().or(z.literal("")),
    image: z.string().url().optional().or(z.literal("")),
  })).optional(),
});
