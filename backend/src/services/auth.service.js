import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { OAuth2Client } from "google-auth-library";
// ====================================
// Generate Access & Refresh Tokens
// ====================================
const googleClient = new OAuth2Client();
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
  };
};

// ====================================
// Register User
// ====================================
export const registerUser = async (userData) => {
  const { fullName, username, email, password } = userData;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, "Email already exists");
    }

    if (existingUser.username === username) {
      throw new ApiError(409, "Username already exists");
    }
  }

  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(createdUser._id);

  return {
    user: createdUser,
    accessToken,
    refreshToken,
  };
};

// ====================================
// Login User
// ====================================
export const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  user.password = undefined;
  user.refreshToken = undefined;

  return {
    user,
    accessToken,
    refreshToken,
  };
};
// ====================================
// Google Login
// ====================================
export const googleLoginUser = async (credential) => {
  if (!credential) {
    throw new ApiError(
      400,
      "Google credential is required"
    );
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(
      500,
      "Google authentication is not configured"
    );
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch (error) {
    console.error("Google token verification failed:", error);

    throw new ApiError(
      401,
      "Invalid Google credential"
    );
  }

  if (!payload) {
    throw new ApiError(
      401,
      "Invalid Google credential"
    );
  }

  const {
    sub: googleId,
    email,
    name,
    picture,
    email_verified: emailVerified,
  } = payload;

  if (!googleId || !email) {
    throw new ApiError(
      401,
      "Google account information is incomplete"
    );
  }

  if (!emailVerified) {
    throw new ApiError(
      401,
      "Google email is not verified"
    );
  }

  // ------------------------------------
  // Check existing Google account
  // ------------------------------------
  let user = await User.findOne({
    googleId,
  }).select("+refreshToken");

  // ------------------------------------
  // Check existing DevPulse account
  // ------------------------------------
  if (!user) {
    user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+refreshToken");
  }

  // ------------------------------------
  // Create new user
  // ------------------------------------
  if (!user) {
    const baseUsername =
      email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .slice(0, 20) || "user";

    let username = baseUsername;
    let counter = 1;

    while (await User.exists({ username })) {
      const suffix = String(counter);

      username =
        `${baseUsername.slice(
          0,
          20 - suffix.length
        )}${suffix}`;

      counter++;
    }

    user = await User.create({
      fullName: name?.trim() || "Google User",
      username,
      email: email.toLowerCase(),
      googleId,
      avatar: picture || "",
    });

    user = await User.findById(user._id).select(
      "+refreshToken"
    );
  } else {
    // ------------------------------------
    // Link Google account to existing user
    // ------------------------------------
    if (!user.googleId) {
      user.googleId = googleId;

      if (!user.avatar && picture) {
        user.avatar = picture;
      }

      await user.save({
        validateBeforeSave: false,
      });
    }
  }

  const {
    accessToken,
    refreshToken,
  } = await generateAccessAndRefreshTokens(
    user._id
  );

  user.password = undefined;
  user.refreshToken = undefined;

  return {
    user,
    accessToken,
    refreshToken,
  };
};
// ====================================
// Logout User
// ====================================
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
};

// ====================================
// Refresh Access Token
// ====================================
export const refreshAccessTokenService = async (
  incomingRefreshToken
) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await User.findById(decodedToken._id).select(
    "+refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(
      401,
      "Refresh token is expired or already used"
    );
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  return {
    accessToken,
    refreshToken,
  };
};