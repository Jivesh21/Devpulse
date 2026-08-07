import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import {
  createPortfolioService,
  getMyPortfolioService,
  getUserPortfolioService,
  updatePortfolioService,
  deletePortfolioService,
} from "../services/portfolio.service.js";

// ======================================
// Create Project
// ======================================
export const createPortfolio = asyncHandler(async (req, res) => {
  let coverImage = "";

  if (req.file?.path) {
    const uploadedImage = await uploadOnCloudinary(
      req.file.path
    );

    coverImage = uploadedImage.secure_url;
  }

  const portfolio = await createPortfolioService(
    req.user._id,
    {
      ...req.body,
      coverImage,
    }
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      portfolio,
      "Project created successfully"
    )
  );
});

// ======================================
// Get My Portfolio
// ======================================
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

// ======================================
// Get User Portfolio
// ======================================
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

// ======================================
// Update Project
// ======================================
// ======================================
// Update Project
// ======================================
export const updatePortfolio = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const updateData = { ...req.body };

  // Never trust coverImage from req.body
  delete updateData.coverImage;

  if (req.file?.path) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);

    updateData.coverImage = uploadedImage.secure_url;
  }

  const portfolio = await updatePortfolioService(
    req.params.portfolioId,
    req.user._id,
    updateData
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      portfolio,
      "Project updated successfully"
    )
  );
});
// ======================================
// Delete Project
// ======================================
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