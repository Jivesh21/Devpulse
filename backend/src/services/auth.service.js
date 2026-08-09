import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TwoFactorChallenge from "../models/twoFactorChallenge.model.js";
import ApiError from "../utils/ApiError.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendTwoFactorCodeEmail,
} from "./email.service.js";

// ====================================
// Google OAuth Client
// ====================================
const googleClient = new OAuth2Client();

// ====================================
// Two-Factor Configuration
// ====================================
const TWO_FACTOR_CODE_EXPIRY = 10 * 60 * 1000;
const TWO_FACTOR_MAX_ATTEMPTS = 5;

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
// Generate Two-Factor Code
// ====================================
const generateTwoFactorCode = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

// ====================================
// Hash Two-Factor Code
// ====================================
const hashTwoFactorCode = (code) => {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
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
// Create Two-Factor Challenge
// ====================================
const createTwoFactorChallenge = async (
  user
) => {
  // Remove any previous challenge
  await TwoFactorChallenge.deleteMany({
    userId: user._id,
  });

  const code = generateTwoFactorCode();

  const codeHash = hashTwoFactorCode(code);

  const challenge =
    await TwoFactorChallenge.create({
      userId: user._id,
      codeHash,
      expiresAt:
        new Date(
          Date.now() +
            TWO_FACTOR_CODE_EXPIRY
        ),
      attempts: 0,
    });

  await sendTwoFactorCodeEmail({
    email: user.email,
    fullName: user.fullName,
    code,
  });

  return challenge;
};

// ====================================
// Register User
// ====================================
export const registerUser = async (
  userData
) => {
  const {
    fullName,
    username,
    email,
    password,
  } = userData;

  const existingUser =
    await User.findOne({
      $or: [{ email }, { username }],
    });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(
        409,
        "Email already exists"
      );
    }

    if (
      existingUser.username ===
      username
    ) {
      throw new ApiError(
        409,
        "Username already exists"
      );
    }
  }

  const {
    rawToken,
    hashedToken,
  } =
    generateEmailVerificationToken();

  const user = await User.create({
    fullName,
    username,
    email,
    password,

    emailVerified: false,

    emailVerificationToken:
      hashedToken,

    emailVerificationExpires:
      Date.now() +
      24 * 60 * 60 * 1000,
  });

  const createdUser =
    await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(
      500,
      "Failed to create user"
    );
  }

  await sendVerificationEmail({
    email: createdUser.email,
    fullName: createdUser.fullName,
    verificationToken: rawToken,
  });

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

  const hashedToken =
    crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

  const user =
    await User.findOne({
      emailVerificationToken:
        hashedToken,

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

  user.emailVerified = true;

  user.emailVerificationToken =
    undefined;

  user.emailVerificationExpires =
    undefined;

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
export const forgotPasswordService =
  async (email) => {
    if (!email) {
      throw new ApiError(
        400,
        "Email is required"
      );
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select(
        "+password +passwordResetToken +passwordResetExpires"
      );

    if (!user) {
      return {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      };
    }

    if (
      user.googleId &&
      !user.password
    ) {
      return {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      };
    }

    const {
      rawToken,
      hashedToken,
    } =
      generatePasswordResetToken();

    user.passwordResetToken =
      hashedToken;

    user.passwordResetExpires =
      Date.now() +
      15 * 60 * 1000;

    await user.save({
      validateBeforeSave: false,
    });

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
export const resetPasswordService =
  async (
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

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user =
      await User.findOne({
        passwordResetToken:
          hashedToken,

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

    user.password = newPassword;

    user.passwordResetToken =
      undefined;

    user.passwordResetExpires =
      undefined;

    user.refreshToken =
      undefined;

    await user.save();

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
export const loginUser = async (
  userData
) => {
  const {
    email,
    password,
  } = userData;

  const normalizedEmail =
    email.toLowerCase().trim();

  const user =
    await User.findOne({
      email: normalizedEmail,
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

  // ====================================
  // Two-Factor Authentication
  // ====================================
  if (user.twoFactorEnabled) {
    const challenge =
      await createTwoFactorChallenge(
        user
      );

    return {
      requiresTwoFactor: true,

      challengeId:
        challenge._id.toString(),

      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  // ====================================
  // Normal Login
  // ====================================
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
    requiresTwoFactor: false,
    user,
    accessToken,
    refreshToken,
  };
};

// ====================================
// Verify Two-Factor Code
// ====================================
export const verifyTwoFactorCode =
  async (
    challengeId,
    code
  ) => {
    if (!challengeId) {
      throw new ApiError(
        400,
        "Two-factor challenge is required"
      );
    }

    if (!code) {
      throw new ApiError(
        400,
        "Verification code is required"
      );
    }

    const challenge =
      await TwoFactorChallenge.findById(
        challengeId
      );

    if (!challenge) {
      throw new ApiError(
        400,
        "Invalid or expired verification request"
      );
    }

    if (
      challenge.expiresAt <
      new Date()
    ) {
      await challenge.deleteOne();

      throw new ApiError(
        400,
        "Verification code has expired"
      );
    }

    if (
      challenge.attempts >=
      TWO_FACTOR_MAX_ATTEMPTS
    ) {
      await challenge.deleteOne();

      throw new ApiError(
        429,
        "Too many verification attempts"
      );
    }

    const normalizedCode =
      String(code).trim();

    if (
      !/^\d{6}$/.test(
        normalizedCode
      )
    ) {
      challenge.attempts += 1;

      await challenge.save();

      throw new ApiError(
        400,
        "Verification code must be 6 digits"
      );
    }

    const codeHash =
      hashTwoFactorCode(
        normalizedCode
      );

    if (
      codeHash !==
      challenge.codeHash
    ) {
      challenge.attempts += 1;

      await challenge.save();

      throw new ApiError(
        401,
        "Invalid verification code"
      );
    }

    const user =
      await User.findById(
        challenge.userId
      ).select(
        "+refreshToken"
      );

    if (!user) {
      await challenge.deleteOne();

      throw new ApiError(
        404,
        "User not found"
      );
    }

    if (!user.twoFactorEnabled) {
      await challenge.deleteOne();

      throw new ApiError(
        400,
        "Two-factor authentication is not enabled"
      );
    }

    // Challenge is single-use
    await challenge.deleteOne();

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
// Enable Two-Factor Authentication
// ====================================
export const enableTwoFactor =
  async (userId) => {
    const user =
      await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    if (user.twoFactorEnabled) {
      return {
        twoFactorEnabled: true,
        message:
          "Two-factor authentication is already enabled",
      };
    }

    user.twoFactorEnabled = true;

    await user.save({
      validateBeforeSave: false,
    });

    return {
      twoFactorEnabled: true,
      message:
        "Two-factor authentication enabled successfully",
    };
  };

// ====================================
// Disable Two-Factor Authentication
// ====================================
export const disableTwoFactor =
  async (userId) => {
    const user =
      await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    user.twoFactorEnabled = false;

    await TwoFactorChallenge.deleteMany({
      userId: user._id,
    });

    await user.save({
      validateBeforeSave: false,
    });

    return {
      twoFactorEnabled: false,
      message:
        "Two-factor authentication disabled successfully",
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

  if (
    !process.env.GOOGLE_CLIENT_ID
  ) {
    throw new ApiError(
      500,
      "Google authentication is not configured"
    );
  }

  let payload;

  try {
    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    payload =
      ticket.getPayload();
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

  if (!emailVerified) {
    throw new ApiError(
      401,
      "Google email is not verified"
    );
  }

  let user =
    await User.findOne({
      googleId,
    }).select("+refreshToken");

  if (!user) {
    user =
      await User.findOne({
        email:
          email.toLowerCase(),
      }).select(
        "+refreshToken"
      );
  }

  if (!user) {
    const baseUsername =
      email
        .split("@")[0]
        .toLowerCase()
        .replace(
          /[^a-z0-9_]/g,
          "_"
        )
        .slice(0, 20) ||
      "user";

    let username =
      baseUsername;

    let counter = 1;

    while (
      await User.exists({
        username,
      })
    ) {
      const suffix =
        String(counter);

      username =
        `${baseUsername.slice(
          0,
          20 - suffix.length
        )}${suffix}`;

      counter++;
    }

    user =
      await User.create({
        fullName:
          name?.trim() ||
          "Google User",

        username,

        email:
          email.toLowerCase(),

        googleId,

        avatar:
          picture || "",

        emailVerified: true,
      });

    user =
      await User.findById(
        user._id
      ).select(
        "+refreshToken"
      );
  } else {
    if (!user.googleId) {
      user.googleId =
        googleId;

      user.emailVerified =
        true;

      if (
        !user.avatar &&
        picture
      ) {
        user.avatar = picture;
      }

      await user.save({
        validateBeforeSave:
          false,
      });
    }
  }

  // ====================================
  // Google + 2FA
  // ====================================
  if (user.twoFactorEnabled) {
    const challenge =
      await createTwoFactorChallenge(
        user
      );

    return {
      requiresTwoFactor: true,

      challengeId:
        challenge._id.toString(),

      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
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
    requiresTwoFactor: false,
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
  async (
    incomingRefreshToken
  ) => {
    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Unauthorized request"
      );
    }

    const decodedToken =
      jwt.verify(
        incomingRefreshToken,
        process.env
          .JWT_REFRESH_SECRET
      );

    const user =
      await User.findById(
        decodedToken._id
      ).select(
        "+refreshToken"
      );

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