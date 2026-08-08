import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "./email.service.js";

// ====================================
// Google OAuth Client
// ====================================
const googleClient = new OAuth2Client();

// ====================================
// Generate Email Verification Token
// ====================================
const generateEmailVerificationToken = () => {
  const rawToken = crypto
    .randomBytes(32)
    .toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    hashedToken,
  };
};

// ====================================
// Generate Password Reset Token
// ====================================
const generatePasswordResetToken = () => {
  const rawToken = crypto
    .randomBytes(32)
    .toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    hashedToken,
  };
};

// ====================================
// Generate Access & Refresh Tokens
// ====================================
const generateAccessAndRefreshTokens = async (
  userId
) => {
  const user = await User.findById(userId).select(
    "+refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken =
    user.generateAccessToken();

  const refreshToken =
    user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken,
  };
};

// ====================================
// Register User
// ====================================
export const registerUser = async (userData) => {
  const {
    fullName,
    username,
    email,
    password,
  } = userData;

  // ------------------------------------
  // Check Existing User
  // ------------------------------------
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(
        409,
        "Email already exists"
      );
    }

    if (existingUser.username === username) {
      throw new ApiError(
        409,
        "Username already exists"
      );
    }
  }

  // ------------------------------------
  // Generate Verification Token
  // ------------------------------------
  const {
    rawToken,
    hashedToken,
  } = generateEmailVerificationToken();

  // ------------------------------------
  // Create User
  // ------------------------------------
  const user = await User.create({
    fullName,
    username,
    email,
    password,

    emailVerified: false,

    emailVerificationToken:
      hashedToken,

    emailVerificationExpires:
      Date.now() + 24 * 60 * 60 * 1000,
  });

  // ------------------------------------
  // Verify User Was Created
  // ------------------------------------
  const createdUser = await User.findById(
    user._id
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Failed to create user"
    );
  }

  // ------------------------------------
  // Send Verification Email
  // ------------------------------------
  await sendVerificationEmail({
    email: createdUser.email,
    fullName: createdUser.fullName,
    verificationToken: rawToken,
  });

  // ------------------------------------
  // Generate Login Tokens
  // ------------------------------------
  const {
    accessToken,
    refreshToken,
  } =
    await generateAccessAndRefreshTokens(
      createdUser._id
    );

  return {
    user: createdUser,
    accessToken,
    refreshToken,
  };
};

// ====================================
// Verify Email
// ====================================
export const verifyEmailService = async (
  token
) => {
  if (!token) {
    throw new ApiError(
      400,
      "Email verification token is required"
    );
  }

  // ------------------------------------
  // Hash Incoming Token
  // ------------------------------------
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // ------------------------------------
  // Find User With Valid Token
  // ------------------------------------
  const user = await User.findOne({
    emailVerificationToken: hashedToken,

    emailVerificationExpires: {
      $gt: Date.now(),
    },
  }).select(
    "+emailVerificationToken +emailVerificationExpires"
  );

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired verification token"
    );
  }

  // ------------------------------------
  // Mark Email As Verified
  // ------------------------------------
  user.emailVerified = true;

  // ------------------------------------
  // Remove Verification Token
  // ------------------------------------
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    emailVerified: true,
  };
};

// ====================================
// Forgot Password
// ====================================
export const forgotPasswordService = async (
  email
) => {
  if (!email) {
    throw new ApiError(
      400,
      "Email is required"
    );
  }

  const normalizedEmail =
    email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select(
    "+password +passwordResetToken +passwordResetExpires"
  );

  // ------------------------------------
  // Don't Reveal Whether Email Exists
  // ------------------------------------
  if (!user) {
    return {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  // ------------------------------------
  // Google-only Account
  // ------------------------------------
  if (user.googleId && !user.password) {
    return {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  // ------------------------------------
  // Generate Reset Token
  // ------------------------------------
  const {
    rawToken,
    hashedToken,
  } = generatePasswordResetToken();

  user.passwordResetToken =
    hashedToken;

  // Token valid for 15 minutes
  user.passwordResetExpires =
    Date.now() + 15 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  // ------------------------------------
  // Send Reset Email
  // ------------------------------------
  await sendPasswordResetEmail({
    email: user.email,
    fullName: user.fullName,
    resetToken: rawToken,
  });

  return {
    message:
      "If an account exists with this email, a password reset link has been sent.",
  };
};

// ====================================
// Reset Password
// ====================================
export const resetPasswordService = async (
  token,
  newPassword
) => {
  if (!token) {
    throw new ApiError(
      400,
      "Password reset token is required"
    );
  }

  if (!newPassword) {
    throw new ApiError(
      400,
      "New password is required"
    );
  }

  // ------------------------------------
  // Hash Incoming Token
  // ------------------------------------
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // ------------------------------------
  // Find User With Valid Reset Token
  // ------------------------------------
  const user = await User.findOne({
    passwordResetToken: hashedToken,

    passwordResetExpires: {
      $gt: Date.now(),
    },
  }).select(
    "+password +passwordResetToken +passwordResetExpires +refreshToken"
  );

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired password reset token"
    );
  }

  // ------------------------------------
  // Update Password
  // ------------------------------------
  user.password = newPassword;

  // ------------------------------------
  // Remove Reset Token
  // ------------------------------------
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // ------------------------------------
  // Invalidate Existing Sessions
  // ------------------------------------
  user.refreshToken = undefined;

  // ------------------------------------
  // Save
  // Password will be hashed by the
  // User model pre-save middleware
  // ------------------------------------
await user.save();

// ------------------------------------
// Send Password Changed Confirmation
// ------------------------------------
await sendPasswordChangedEmail({
  email: user.email,
  fullName: user.fullName,
});

return {
  message:
    "Password reset successfully. You can now log in with your new password.",
};
};

// ====================================
// Login User
// ====================================
export const loginUser = async (userData) => {
  const {
    email,
    password,
  } = userData;

  const user = await User.findOne({
    email,
  }).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new ApiError(
      401,
      "Invalid credentials"
    );
  }

  const isPasswordValid =
    await user.isPasswordCorrect(
      password
    );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid credentials"
    );
  }

  const {
    accessToken,
    refreshToken,
  } =
    await generateAccessAndRefreshTokens(
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
// Google Login
// ====================================
export const googleLoginUser = async (
  credential
) => {
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

  // ------------------------------------
  // Verify Google Credential
  // ------------------------------------
  try {
    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    payload = ticket.getPayload();
  } catch (error) {
    console.error(
      "Google token verification failed:",
      error
    );

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
    email_verified:
      emailVerified,
  } = payload;

  if (!googleId || !email) {
    throw new ApiError(
      401,
      "Google account information is incomplete"
    );
  }

  // ------------------------------------
  // Google Email Must Be Verified
  // ------------------------------------
  if (!emailVerified) {
    throw new ApiError(
      401,
      "Google email is not verified"
    );
  }

  // ------------------------------------
  // Check Existing Google Account
  // ------------------------------------
  let user = await User.findOne({
    googleId,
  }).select("+refreshToken");

  // ------------------------------------
  // Check Existing DevPulse Account
  // ------------------------------------
  if (!user) {
    user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+refreshToken");
  }

  // ------------------------------------
  // Create New Google User
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

    while (
      await User.exists({ username })
    ) {
      const suffix = String(counter);

      username =
        `${baseUsername.slice(
          0,
          20 - suffix.length
        )}${suffix}`;

      counter++;
    }

    user = await User.create({
      fullName:
        name?.trim() || "Google User",

      username,

      email: email.toLowerCase(),

      googleId,

      avatar: picture || "",

      emailVerified: true,
    });

    user = await User.findById(
      user._id
    ).select("+refreshToken");
  } else {
    // ------------------------------------
    // Link Google Account
    // ------------------------------------
    if (!user.googleId) {
      user.googleId = googleId;

      // Google has verified this email
      user.emailVerified = true;

      if (!user.avatar && picture) {
        user.avatar = picture;
      }

      await user.save({
        validateBeforeSave: false,
      });
    }
  }

  // ------------------------------------
  // Generate Application Tokens
  // ------------------------------------
  const {
    accessToken,
    refreshToken,
  } =
    await generateAccessAndRefreshTokens(
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
export const logoutUser = async (
  userId
) => {
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
export const refreshAccessTokenService =
  async (incomingRefreshToken) => {
    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Unauthorized request"
      );
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(
      decodedToken._id
    ).select("+refreshToken");

    if (!user) {
      throw new ApiError(
        401,
        "Invalid refresh token"
      );
    }

    if (
      incomingRefreshToken !==
      user.refreshToken
    ) {
      throw new ApiError(
        401,
        "Refresh token is expired or already used"
      );
    }

    const {
      accessToken,
      refreshToken,
    } =
      await generateAccessAndRefreshTokens(
        user._id
      );

    return {
      accessToken,
      refreshToken,
    };
  };