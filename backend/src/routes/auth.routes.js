import { Router } from "express";

import {
  register,
  login,
  googleLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  refreshAccessToken,
  getCurrentUser,
  verifyTwoFactor,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import validate from "../middlewares/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

import {
  authLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed
 */
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully or two-factor verification required
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login with Google
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google login successful or two-factor verification required
 *       401:
 *         description: Invalid Google credential
 */
router.post(
  "/google",
  authLimiter,
  googleLogin
);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get(
  "/verify-email/:token",
  verifyEmail
);

// ====================================
// Two-Factor Authentication
// ====================================

/**
 * @swagger
 * /auth/2fa/verify:
 *   post:
 *     summary: Verify two-factor authentication code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challengeId
 *               - code
 *             properties:
 *               challengeId:
 *                 type: string
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Two-factor verification successful
 *       400:
 *         description: Invalid or expired verification request
 *       401:
 *         description: Invalid verification code
 */
router.post(
  "/2fa/verify",
  authLimiter,
  verifyTwoFactor
);

/**
 * @swagger
 * /auth/2fa/enable:
 *   post:
 *     summary: Enable two-factor authentication
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Two-factor authentication enabled successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/2fa/enable",
  verifyJWT,
  enableTwoFactorAuth
);

/**
 * @swagger
 * /auth/2fa/disable:
 *   post:
 *     summary: Disable two-factor authentication
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Two-factor authentication disabled successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/2fa/disable",
  verifyJWT,
  disableTwoFactorAuth
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 */
router.post(
  "/refresh-token",
  refreshAccessToken
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  verifyJWT,
  getCurrentUser
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/logout",
  verifyJWT,
  logout
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Password reset request processed
 */
router.post(
  "/forgot-password",
  authLimiter,
  forgotPassword
);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post(
  "/reset-password/:token",
  authLimiter,
  resetPassword
);

export default router;