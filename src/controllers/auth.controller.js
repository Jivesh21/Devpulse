import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import cookieOptions from "../utils/cookieOptions.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessTokenService,
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

// ======================
// Refresh Access Token
// ======================
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  const { accessToken, refreshToken } =
    await refreshAccessTokenService(incomingRefreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        null,
        "Access token refreshed successfully"
      )
    );
});