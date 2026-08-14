import { Router } from "express";

import {
  fetchGithubProfile,
  fetchGithubContributions,
  connectGithub,
  githubCallback,
  getConnectedGithub,
  disconnectGithub,
} from "../controllers/github.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

console.log("✅ GitHub Router Loaded");

// ====================================
// GitHub OAuth Routes
// ====================================

// User must be logged into DevPulse
// before connecting GitHub.

router.get(
  "/connect",
  verifyJWT,
  connectGithub
);

// GitHub redirects back here after authorization.

router.get(
  "/callback",
  verifyJWT,
  githubCallback
);

// Get currently connected GitHub account

router.get(
  "/me",
  verifyJWT,
  getConnectedGithub
);

// Disconnect GitHub

router.post(
  "/disconnect",
  verifyJWT,
  disconnectGithub
);

// ====================================
// Public GitHub Contribution Activity
// ====================================

// IMPORTANT:
// This route must come before
// /:username.

router.get(
  "/:username/contributions",
  fetchGithubContributions
);

// ====================================
// Public GitHub Profile
// ====================================

// Example:
// GET /github/jivii21

router.get(
  "/:username",
  fetchGithubProfile
);

export default router;