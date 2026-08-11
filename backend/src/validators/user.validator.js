import { z } from "zod";

// ====================================
// Update Profile Validation
// ====================================

export const updateProfileSchema = z.object({
  // ====================================
  // Basic Profile
  // ====================================

  bio: z
    .string()
    .trim()
    .max(250, "Bio cannot exceed 250 characters")
    .optional()
    .or(z.literal("")),

  skills: z
    .array(z.string().trim())
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

  // ====================================
  // Experience
  // ====================================

  experience: z
    .array(
      z.object({
        company: z
          .string()
          .trim()
          .max(100, "Company name cannot exceed 100 characters")
          .optional(),

        position: z
          .string()
          .trim()
          .max(100, "Position cannot exceed 100 characters")
          .optional(),

        location: z
          .string()
          .trim()
          .max(100, "Location cannot exceed 100 characters")
          .optional(),

        currentlyWorking: z
          .boolean()
          .optional(),

        startDate: z
          .string()
          .optional(),

        endDate: z
          .string()
          .optional(),

        // Quill sends HTML, so allow more than
        // the old 1000-character limit.
        description: z
          .string()
          .max(
            5000,
            "Experience description cannot exceed 5000 characters"
          )
          .optional(),
      })
    )
    .optional(),

  // ====================================
  // Education
  // ====================================

  education: z
    .array(
      z.object({
        institution: z
          .string()
          .trim()
          .max(
            150,
            "Institution name cannot exceed 150 characters"
          )
          .optional(),

        degree: z
          .string()
          .trim()
          .max(
            100,
            "Degree cannot exceed 100 characters"
          )
          .optional(),

        fieldOfStudy: z
          .string()
          .trim()
          .max(
            100,
            "Field of study cannot exceed 100 characters"
          )
          .optional(),

        startDate: z
          .string()
          .optional(),

        endDate: z
          .string()
          .optional(),

        grade: z
          .string()
          .trim()
          .max(50, "Grade cannot exceed 50 characters")
          .optional(),

        description: z
          .string()
          .max(
            5000,
            "Education description cannot exceed 5000 characters"
          )
          .optional(),
      })
    )
    .optional(),

  // ====================================
  // Certificates
  // ====================================

  certificates: z
    .array(
      z.object({
        title: z
          .string()
          .trim()
          .max(
            150,
            "Certificate title cannot exceed 150 characters"
          )
          .optional(),

        issuer: z
          .string()
          .trim()
          .max(
            100,
            "Certificate issuer cannot exceed 100 characters"
          )
          .optional(),

        issueDate: z
          .string()
          .optional(),

        credentialUrl: z
          .string()
          .url("Please provide a valid credential URL")
          .optional()
          .or(z.literal("")),

        image: z
          .string()
          .url("Please provide a valid certificate image URL")
          .optional()
          .or(z.literal("")),
      })
    )
    .optional(),
});