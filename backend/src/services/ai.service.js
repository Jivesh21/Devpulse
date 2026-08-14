import { GoogleGenAI } from "@google/genai";

// ====================================
// Gemini Configuration
// ====================================

const ai = new GoogleGenAI({
  apiKey:
    process.env.GEMINI_API_KEY,
});

// ====================================
// Build DevPulse Context Text
// ====================================

const buildDevPulseContextText = (
  context
) => {
  const sections = [];

  // ====================================
  // Basic Profile
  // ====================================

  sections.push(`
Name: ${context.fullName || "Not provided"}
Username: ${context.username || "Not provided"}

Bio:
${context.bio || "Not provided"}

Skills:
${
  context.skills?.length
    ? context.skills.join(", ")
    : "Not provided"
}

GitHub:
${context.github || "Not provided"}

LinkedIn:
${context.linkedin || "Not provided"}

Website:
${context.website || "Not provided"}
`);

  // ====================================
  // Education
  // ====================================

  if (
    context.education?.length
  ) {
    sections.push(`
Education:
${context.education
  .map(
    (item) =>
      `- ${
        item.degree ||
        "Degree not specified"
      }${
        item.fieldOfStudy
          ? ` in ${item.fieldOfStudy}`
          : ""
      } at ${
        item.institution ||
        "Institution not specified"
      }${
        item.grade
          ? ` (Grade: ${item.grade})`
          : ""
      }${
        item.description
          ? ` — ${item.description}`
          : ""
      }`
  )
  .join("\n")}
`);
  }

  // ====================================
  // Experience
  // ====================================

  if (
    context.experience?.length
  ) {
    sections.push(`
Experience:
${context.experience
  .map(
    (item) =>
      `- ${
        item.position ||
        "Position not specified"
      } at ${
        item.company ||
        "Company not specified"
      }${
        item.location
          ? ` (${item.location})`
          : ""
      }${
        item.currentlyWorking
          ? " — Currently working"
          : ""
      }${
        item.description
          ? ` — ${item.description}`
          : ""
      }`
  )
  .join("\n")}
`);
  }

  // ====================================
  // Certificates
  // ====================================

  if (
    context.certificates?.length
  ) {
    sections.push(`
Certificates:
${context.certificates
  .map(
    (item) =>
      `- ${
        item.title ||
        "Certificate"
      }${
        item.issuer
          ? ` — ${item.issuer}`
          : ""
      }`
  )
  .join("\n")}
`);
  }

  return sections.join("\n");
};

// ====================================
// Generate AI Response Stream
// ====================================

export const generateAIResponseStream =
  async (
    messages,
    devPulseContext
  ) => {
    try {
      // ====================================
      // Build User Context
      // ====================================

      const contextText =
        buildDevPulseContextText(
          devPulseContext
        );

      // ====================================
      // System Instruction
      // ====================================

      const systemInstruction =
        `
You are DevPulse AI, a helpful
developer-focused AI assistant
inside the DevPulse platform.

Your job is to help the user with:

- Programming concepts
- Debugging
- Code review
- Development skills
- MERN stack development
- JavaScript and React
- Node.js and backend development
- Project ideas
- Resume improvement
- Interview preparation
- Career and internship guidance

The user profile below is private
context provided by DevPulse.

Use it when it is relevant to the
user's question.

Do not expose, repeat, or speculate
about private information that is not
relevant to the user's request.

Never claim that information exists
when it is not present in the profile.

If the user asks about their skills,
experience, education, projects,
certificates, GitHub, or career,
prefer using the DevPulse profile
context when relevant.

If the profile does not contain enough
information to answer a personalized
question, clearly say what information
is missing instead of inventing it.

DEV PULSE USER PROFILE:

${contextText}

====================================
RESPONSE FORMATTING RULES
====================================

Use Markdown to make responses easy
to read.

Use headings when appropriate.

Use bullet lists when presenting
multiple unordered items.

When the user asks for a specific
number of points, ALWAYS use a
Markdown numbered list with:

1.
2.
3.

Do not represent numbered points as
separate paragraphs.

Use fenced Markdown code blocks for
multi-line code examples.

Use inline code formatting for:

- variable names
- functions
- commands
- file names
- routes
- short code snippets

Keep explanations concise unless the
user asks for detailed information.

Be practical, accurate, and honest.
`;

      // ====================================
      // Generate Gemini Stream
      // ====================================

      const responseStream =
        await ai.models.generateContentStream(
          {
            model:
              "gemini-3.5-flash",

            contents: messages,

            config: {
              systemInstruction,
            },
          }
        );

      return responseStream;
   } catch (error) {
  console.error(
    "Gemini API error:",
    error
  );

  const statusCode =
    error?.status ||
    error?.statusCode ||
    error?.response?.status ||
    500;

  let message =
    error?.message ||
    "Unable to generate AI response.";

  // ====================================
  // Gemini Rate Limit
  // ====================================

  if (statusCode === 429) {
    message =
      "DevPulse AI is temporarily unavailable because the AI usage limit has been reached. Please try again later.";
  }

  // ====================================
  // Gemini Service Unavailable
  // ====================================

  if (statusCode === 503) {
    message =
      "DevPulse AI is temporarily unavailable because the AI model is experiencing high demand. Please try again in a moment.";
  }

  const aiError =
    new Error(message);

  aiError.statusCode =
    statusCode;

  throw aiError;
}
}
