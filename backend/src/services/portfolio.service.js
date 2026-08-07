import { Portfolio } from "../models/portfolio.model.js";
import ApiError from "../utils/ApiError.js";

// ======================================
// Create Portfolio Project
// ======================================
export const createPortfolioService = async (
  userId,
  data
) => {
  const portfolio = await Portfolio.create({
    owner: userId,
    ...data,
  });

  return portfolio;
};

// ======================================
// Get Logged-in User Portfolio
// ======================================
export const getMyPortfolioService = async (
  userId
) => {
  return Portfolio.find({
    owner: userId,
  }).sort({
    featured: -1,
    order: 1,
    createdAt: -1,
  });
};

// ======================================
// Get Public Portfolio
// ======================================
export const getUserPortfolioService = async (
  userId
) => {
  return Portfolio.find({
    owner: userId,
  }).sort({
    featured: -1,
    order: 1,
    createdAt: -1,
  });
};

// ======================================
// Update Portfolio
// ======================================
export const updatePortfolioService = async (
  portfolioId,
  userId,
  data
) => {
  const portfolio =
    await Portfolio.findOneAndUpdate(
      {
        _id: portfolioId,
        owner: userId,
      },
      data,
      {
        new: true,
        runValidators: true,
      }
    );

  if (!portfolio) {
    throw new ApiError(
      404,
      "Portfolio project not found"
    );
  }

  return portfolio;
};

// ======================================
// Delete Portfolio
// ======================================
export const deletePortfolioService = async (
  portfolioId,
  userId
) => {
  const portfolio =
    await Portfolio.findOneAndDelete({
      _id: portfolioId,
      owner: userId,
    });

  if (!portfolio) {
    throw new ApiError(
      404,
      "Portfolio project not found"
    );
  }

  return portfolio;
};