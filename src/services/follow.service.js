import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

// ====================================
// Toggle Follow
// ====================================
export const toggleFollowService = async (
  currentUserId,
  targetUserId
) => {
  // Prevent self follow
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError(
      400,
      "You cannot follow yourself"
    );
  }

  // Check target user exists
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if already following
  const existingFollow = await Follow.findOne({
    follower: currentUserId,
    following: targetUserId,
  });

  if (existingFollow) {
    await Follow.findByIdAndDelete(existingFollow._id);

    return {
      following: false,
      message: "User unfollowed successfully",
    };
  }

  // Follow user
  await Follow.create({
    follower: currentUserId,
    following: targetUserId,
  });

  return {
    following: true,
    message: "User followed successfully",
  };
};

// ====================================
// Get Followers Count
// ====================================
export const getFollowersCountService = async (
  userId
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const followersCount = await Follow.countDocuments({
    following: userId,
  });

  return {
    followersCount,
  };
};

// ====================================
// Get Following Count
// ====================================
export const getFollowingCountService = async (
  userId
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const followingCount = await Follow.countDocuments({
    follower: userId,
  });

  return {
    followingCount,
  };
};

// ====================================
// Get Follow Status
// ====================================
export const getFollowStatusService = async (
  currentUserId,
  targetUserId
) => {
  const user = await User.findById(targetUserId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const follow = await Follow.findOne({
    follower: currentUserId,
    following: targetUserId,
  });

  return {
    isFollowing: !!follow,
  };
};

// ====================================
// Get Followers List
// ====================================
export const getFollowersService = async (
  userId,
  page = 1,
  limit = 10
) => {
  // Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Pagination
  const skip =
    (Number(page) - 1) * Number(limit);

  // Fetch followers
  const followers = await Follow.find({
    following: userId,
  })
    .populate(
      "follower",
      "fullName username avatar"
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(Number(limit));

  // Count followers
  const totalFollowers =
    await Follow.countDocuments({
      following: userId,
    });

  return {
    followers,
    totalFollowers,
    currentPage: Number(page),
    totalPages: Math.ceil(
      totalFollowers / Number(limit)
    ),
  };
};

// ====================================
// Get Following List
// ====================================
export const getFollowingService = async (
  userId,
  page = 1,
  limit = 10
) => {
  // Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Pagination
  const skip =
    (Number(page) - 1) * Number(limit);

  // Fetch following users
  const following = await Follow.find({
    follower: userId,
  })
    .populate(
      "following",
      "fullName username avatar"
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(Number(limit));

  // Count following
  const totalFollowing =
    await Follow.countDocuments({
      follower: userId,
    });

  return {
    following,
    totalFollowing,
    currentPage: Number(page),
    totalPages: Math.ceil(
      totalFollowing / Number(limit)
    ),
  };
};