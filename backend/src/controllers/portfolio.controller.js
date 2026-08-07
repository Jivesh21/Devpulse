import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createPortfolioService,
  getMyPortfolioService,
  getUserPortfolioService,
  updatePortfolioService,
  deletePortfolioService,
} from "../services/portfolio.service.js";

// ===============================
// Create Project
// ===============================
export const createPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await createPortfolioService(
    req.user._id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      portfolio,
      "Project created successfully"
    )
  );
});

// ===============================
// My Portfolio
// ===============================
export const getMyPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await getMyPortfolioService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      portfolio,
      "Portfolio fetched successfully"
    )
  );
});

// ===============================
// Public Portfolio
// ===============================
export const getUserPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await getUserPortfolioService(
    req.params.userId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      portfolio,
      "Portfolio fetched successfully"
    )
  );
});

// ===============================
// Update Project
// ===============================
export const updatePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await updatePortfolioService(
    req.params.portfolioId,
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      portfolio,
      "Project updated successfully"
    )
  );
});

// ===============================
// Delete Project
// ===============================
export const deletePortfolio = asyncHandler(async (req, res) => {
  await deletePortfolioService(
    req.params.portfolioId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Project deleted successfully"
    )
  );
});