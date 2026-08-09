import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import bookmarkRouter from "./routes/bookmark.routes.js";
import swaggerSpec from "./config/swagger.js";
import analyticsRouter from "./routes/analytics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import followRouter from "./routes/follow.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import feedRouter from "./routes/feed.routes.js";
import githubRouter from "./routes/github.routes.js";
import ApiError from "./utils/ApiError.js";
import errorHandler from "./middlewares/error.middleware.js";
import portfolioRouter from "./routes/portfolio.routes.js";

const app = express();

/**
 * ====================================
 * Security Middlewares
 * ====================================
 */
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
/**
 * ====================================
 * Logging
 * ====================================
 */
app.use(morgan("dev"));

/**
 * ====================================
 * Body Parsers
 * ====================================
 */
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/**
 * ====================================
 * Swagger Documentation
 * ====================================
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/**
 * ====================================
 * Health Check
 * ====================================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DevPulse API 🚀",
  });
});
app.use(
  "/api/v1/analytics",
  analyticsRouter
);

/**
 * ====================================
 * API Routes
 * ====================================
 */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/feed", feedRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);
app.use("/api/v1/github", githubRouter);
app.use("/api/v1/portfolio", portfolioRouter);

/**
 * ====================================
 * 404 Route Handler
 * ====================================
 */
app.use((req, res, next) => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.originalUrl}`
    )
  );
});

/**
 * ====================================
 * Global Error Handler
 * ====================================
 */
app.use(errorHandler);

export default app;