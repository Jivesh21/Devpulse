import rateLimit from "express-rate-limit";

// ====================================
// AI Chat Rate Limiter
// ====================================

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,

  // Maximum AI requests per minute per IP
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many AI requests. Please wait a moment and try again.",
    errors: [],
  },
});

export default aiRateLimiter;