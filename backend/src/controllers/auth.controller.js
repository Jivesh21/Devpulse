import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import cookieOptions from "../utils/cookieOptions.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessTokenService,
  verifyEmailService,
  googleLoginUser,
  forgotPasswordService,
  resetPasswordService,
  verifyTwoFactorCode,
  enableTwoFactor,
  disableTwoFactor,
} from "../services/auth.service.js";

// ======================
// Register
// ======================
export const register = asyncHandler(
  async (req, res) => {
    const result = await registerUser(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "User registered successfully"
      )
    );
  }
);

// ======================
// Login
// ======================
export const login = asyncHandler(
  async (req, res) => {
    const result = await loginUser(req.body);

    // ====================================
    // Two-Factor Authentication Required
    // ====================================
    if (result.requiresTwoFactor) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            requiresTwoFactor: true,
            challengeId: result.challengeId,
            user: result.user,
          },
          "Two-factor verification required"
        )
      );
    }

    // ====================================
    // Normal Login
    // ====================================
    return res
      .status(200)
      .cookie(
        "accessToken",
        result.accessToken,
        cookieOptions
      )
      .cookie(
        "refreshToken",
        result.refreshToken,
        cookieOptions
      )
      .json(
        new ApiResponse(
          200,
          {
            requiresTwoFactor: false,
            user: result.user,
          },
          "User logged in successfully"
        )
      );
  }
);

// ======================
// Google Login
// ======================
export const googleLogin = asyncHandler(
  async (req, res) => {
    const { credential } = req.body;

    const result =
      await googleLoginUser(credential);

    // ====================================
    // Two-Factor Authentication Required
    // ====================================
    if (result.requiresTwoFactor) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            requiresTwoFactor: true,
            challengeId: result.challengeId,
            user: result.user,
          },
          "Two-factor verification required"
        )
      );
    }

    // ====================================
    // Normal Google Login
    // ====================================
    return res
      .status(200)
      .cookie(
        "accessToken",
        result.accessToken,
        cookieOptions
      )
      .cookie(
        "refreshToken",
        result.refreshToken,
        cookieOptions
      )
      .json(
        new ApiResponse(
          200,
          {
            requiresTwoFactor: false,
            user: result.user,
          },
          "Google login successful"
        )
      );
  }
);

// ======================
// Verify Two-Factor Code
// ======================
export const verifyTwoFactor = asyncHandler(
  async (req, res) => {
    const {
      challengeId,
      code,
    } = req.body;

    const result =
      await verifyTwoFactorCode(
        challengeId,
        code
      );

    return res
      .status(200)
      .cookie(
        "accessToken",
        result.accessToken,
        cookieOptions
      )
      .cookie(
        "refreshToken",
        result.refreshToken,
        cookieOptions
      )
      .json(
        new ApiResponse(
          200,
          {
            user: result.user,
          },
          "Two-factor verification successful"
        )
      );
  }
);

// ======================
// Enable Two-Factor Authentication
// ======================
export const enableTwoFactorAuth =
  asyncHandler(
    async (req, res) => {
      const {
        password,
        credential,
      } = req.body;

      const result =
        await enableTwoFactor(
          req.user._id,
          password,
          credential
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          result,
          "Two-factor authentication enabled successfully"
        )
      );
    }
  );

// ======================
// Disable Two-Factor Authentication
// ======================
export const disableTwoFactorAuth =
  asyncHandler(
    async (req, res) => {
      const {
        password,
        credential,
      } = req.body;

      const result =
        await disableTwoFactor(
          req.user._id,
          password,
          credential
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          result,
          "Two-factor authentication disabled successfully"
        )
      );
    }
  );

// ======================
// Get Current User
// ======================
export const getCurrentUser =
  asyncHandler(
    async (req, res) => {
      return res.status(200).json(
        new ApiResponse(
          200,
          req.user,
          "Current user fetched successfully"
        )
      );
    }
  );

// ======================
// Logout
// ======================
export const logout = asyncHandler(
  async (req, res) => {
    await logoutUser(req.user._id);

    return res
      .status(200)
      .clearCookie(
        "accessToken",
        cookieOptions
      )
      .clearCookie(
        "refreshToken",
        cookieOptions
      )
      .json(
        new ApiResponse(
          200,
          null,
          "User logged out successfully"
        )
      );
  }
);

// ====================================
// Forgot Password
// ====================================
export const forgotPassword =
  asyncHandler(
    async (req, res) => {
      const { email } = req.body;

      const result =
        await forgotPasswordService(
          email
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          result,
          "If an account exists, a password reset link has been sent."
        )
      );
    }
  );

// ====================================
// Reset Password
// ====================================
export const resetPassword =
  asyncHandler(
    async (req, res) => {
      const { token } = req.params;
      const { newPassword } = req.body;

      const result =
        await resetPasswordService(
          token,
          newPassword
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          result,
          "Password reset successfully"
        )
      );
    }
  );

// ====================================
// Verify Email
// ====================================
export const verifyEmail =
  asyncHandler(
    async (req, res) => {
      const { token } = req.params;

      const result =
        await verifyEmailService(token);

      return res.status(200).json(
        new ApiResponse(
          200,
          result,
          "Email verified successfully"
        )
      );
    }
  );

// ======================
// Refresh Access Token
// ======================
export const refreshAccessToken =
  asyncHandler(
    async (req, res) => {
      const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

      const {
        accessToken,
        refreshToken,
      } =
        await refreshAccessTokenService(
          incomingRefreshToken
        );

      return res
        .status(200)
        .cookie(
          "accessToken",
          accessToken,
          cookieOptions
        )
        .cookie(
          "refreshToken",
          refreshToken,
          cookieOptions
        )
        .json(
          new ApiResponse(
            200,
            null,
            "Access token refreshed successfully"
          )
        );
    }
  );