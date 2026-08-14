import crypto from "crypto";

import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

import {
  getGithubAuthorizationUrl,
  exchangeGithubCode,
  getAuthenticatedGithubUser,
  getAuthenticatedGithubRepositories,
  getGithubProfile,
  getGithubRepositories,
  getGithubContributionCalendar,
} from "../services/github.service.js";

// ====================================
// Connect GitHub
// ====================================

export const connectGithub = asyncHandler(
  async (req, res) => {
    const state = crypto
      .randomBytes(32)
      .toString("hex");

    const authorizationUrl =
      getGithubAuthorizationUrl(state);

    res.cookie(
      "github_oauth_state",
      state,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",
        maxAge: 10 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      data: {
        authorizationUrl,
      },
      message:
        "GitHub authorization URL generated successfully",
    });
  }
);

// ====================================
// GitHub OAuth Callback
// ====================================

export const githubCallback =
  asyncHandler(async (req, res) => {
    const {
      code,
      state,
      error,
    } = req.query;

    // ====================================
    // GitHub Authorization Cancelled
    // ====================================

    if (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings?github=cancelled`
      );
    }

    // ====================================
    // Missing OAuth Parameters
    // ====================================

    if (!code || !state) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings?github=failed`
      );
    }

    // ====================================
    // Validate OAuth State
    // ====================================

    const storedState =
      req.cookies?.github_oauth_state;

    if (
      !storedState ||
      storedState !== state
    ) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings?github=invalid_state`
      );
    }

    // ====================================
    // Exchange Code For Token
    // ====================================

    const accessToken =
      await exchangeGithubCode(code);

    // ====================================
    // Get GitHub User
    // ====================================

    const githubUser =
      await getAuthenticatedGithubUser(
        accessToken
      );

    // ====================================
    // Save GitHub Connection
    // ====================================

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          githubIntegration: {
            connected: true,
            githubId:
              String(githubUser.id),
            username:
              githubUser.login,
            accessToken,
            connectedAt:
              new Date(),
          },

          github:
            `https://github.com/${githubUser.login}`,
        },
      }
    );

    // ====================================
    // Clear OAuth State
    // ====================================

    res.clearCookie(
      "github_oauth_state"
    );

    // ====================================
    // Redirect To Frontend
    // ====================================

    return res.redirect(
      `${process.env.FRONTEND_URL}/settings?github=connected`
    );
  });

// ====================================
// Get Connected GitHub Data
// ====================================

export const getConnectedGithub =
  asyncHandler(async (req, res) => {
    const user =
      await User.findById(req.user._id)
        .select(
          "+githubIntegration.accessToken"
        );

    if (
      !user?.githubIntegration
        ?.connected
    ) {
      return res.status(404).json({
        success: false,
        message:
          "GitHub account is not connected",
      });
    }

    const githubUser =
      await getAuthenticatedGithubUser(
        user.githubIntegration
          .accessToken
      );

    const repositories =
      await getAuthenticatedGithubRepositories(
        user.githubIntegration
          .accessToken
      );

    return res.status(200).json({
      success: true,
      data: {
        profile: githubUser,
        repositories,
      },
    });
  });

// ====================================
// Disconnect GitHub
// ====================================

export const disconnectGithub =
  asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "githubIntegration.connected":
            false,

          "githubIntegration.githubId":
            "",

          "githubIntegration.username":
            "",

          "githubIntegration.accessToken":
            "",

          "githubIntegration.connectedAt":
            null,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "GitHub account disconnected successfully",
    });
  });

// ====================================
// Public GitHub Profile
// ====================================

export const fetchGithubProfile =
  async (req, res) => {
    try {
      const { username } =
        req.params;

      if (!username) {
        return res.status(400).json({
          success: false,
          message:
            "GitHub username is required",
        });
      }

      // ====================================
      // Public GitHub Profile
      // ====================================

      const profile =
        await getGithubProfile(
          username
        );

      // ====================================
      // Public GitHub Repositories
      // ====================================

      const repositories =
        await getGithubRepositories(
          username
        );

      return res.status(200).json({
        success: true,
        data: {
          profile,
          repositories,
        },
      });
    } catch (error) {
      console.error(
        "GitHub public profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ====================================
// GitHub Contribution Calendar
// ====================================

export const fetchGithubContributions =
  async (req, res) => {
    try {
      const { username } =
        req.params;

      if (!username) {
        return res.status(400).json({
          success: false,
          message:
            "GitHub username is required",
        });
      }

      // ====================================
      // Find Connected DevPulse User
      // ====================================

      const user =
        await User.findOne({
          "githubIntegration.username":
            username,
          "githubIntegration.connected":
            true,
        }).select(
          "+githubIntegration.accessToken"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "GitHub account is not connected to DevPulse",
        });
      }

      const accessToken =
        user.githubIntegration
          .accessToken;

      if (!accessToken) {
        return res.status(404).json({
          success: false,
          message:
            "GitHub access token is unavailable",
        });
      }

      // ====================================
      // Fetch Contribution Calendar
      // ====================================

      const contributionCalendar =
        await getGithubContributionCalendar(
          username,
          accessToken
        );

      return res.status(200).json({
        success: true,
        data: contributionCalendar,
      });
    } catch (error) {
      console.error(
        "GitHub contribution error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };