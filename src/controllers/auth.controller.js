import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { registerUser, loginUser } from "../services/auth.service.js";

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

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "User logged in successfully"
    )
  );
});