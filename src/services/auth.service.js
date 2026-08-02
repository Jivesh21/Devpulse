import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";


const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
  };
};

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

const { accessToken, refreshToken } =
  await generateAccessAndRefreshTokens(user._id);

// Remove sensitive fields before sending response
user.password = undefined;
user.refreshToken = undefined;

return {
  user,
  accessToken,
  refreshToken,
};
}; // ✅ This closes loginUser

export const logoutUser = async (userId) => {
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