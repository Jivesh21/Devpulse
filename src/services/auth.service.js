import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = async (userData) => {
  const { fullName, username, email, password } = userData;

  // Check if email or username already exists
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

  // Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });

  // Fetch created user (password is excluded because of select: false)
  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  // Generate Access Token
  const accessToken = createdUser.generateAccessToken();

  return {
    user: createdUser,
    accessToken,
  };
};

// =========================
// Login User
// =========================
export const loginUser = async (userData) => {
  const { email, password } = userData;

  // Find user and include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Compare password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate Access Token
  const accessToken = user.generateAccessToken();

  // Remove password before sending response
  user.password = undefined;

  return {
    user,
    accessToken,
  };
};