import { Router } from "express";

import {
  fetchGithubProfile,
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
// We need the DevPulse user so we know whose
// GitHub account to save.
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
// Public GitHub Profile
// ====================================

// Example:
// GET /github/jivii21
router.get(
  "/:username",
  fetchGithubProfile
);

export default router;