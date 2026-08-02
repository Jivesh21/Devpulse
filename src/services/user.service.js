import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const updateProfileService = async (userId, profileData) => {
  const {
    bio,
    skills,
    github,
    linkedin,
    website,
  } = profileData;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      bio,
      skills,
      github,
      linkedin,
      website,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return updatedUser;
};