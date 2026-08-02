import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/**
 * Global Middlewares
 */

// Parse JSON data
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DevPulse API ",
  });
});

export default app;