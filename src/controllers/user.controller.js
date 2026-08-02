import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { updateProfileService } from "../services/user.service.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateProfileService(
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedUser,
      "Profile updated successfully"
    )
  );
});