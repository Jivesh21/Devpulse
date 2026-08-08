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
} from "../services/auth.service.js";

// ======================
// Register
// ======================
export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "User registered successfully"
    )
  );
});

// ======================
// Login
// ======================
export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, cookieOptions)
    .cookie("refreshToken", result.refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: result.user,
        },
        "User logged in successfully"
      )
    );
});
// ======================
// Google Login
// ======================
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  const result = await googleLoginUser(credential);

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, cookieOptions)
    .cookie("refreshToken", result.refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: result.user,
        },
        "Google login successful"
      )
    );
});
// ======================
// Get Current User
// ======================
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  );
});

// ======================
// Logout
// ======================
export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new ApiResponse(
        200,
        null,
        "User logged out successfully"
      )
    );
});
// ====================================
// Forgot Password
// ====================================
export const forgotPassword = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    const result =
      await forgotPasswordService(email);

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "If an account exists with this email, a password reset link has been sent."
      )
    );
  }
);

// ====================================
// Reset Password
// ====================================
export const resetPassword = asyncHandler(
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
export const verifyEmail = asyncHandler(
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
export const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log("========== REFRESH TOKEN ==========");
  console.log("Cookies:", req.cookies);
  console.log("Body:", req.body);

  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken;

  console.log(
    "Incoming Refresh Token:",
    incomingRefreshToken
  );

  const { accessToken, refreshToken } =
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
});