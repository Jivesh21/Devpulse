import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Bookmark from "../models/bookmark.model.js";
// ====================================
// Get Trending Hashtags
// ====================================
export const getTrendingHashtagsService =
  async () => {
    const trending = await Post.aggregate([
      {
        $unwind: "$hashtags",
      },

      {
        $group: {
          _id: "$hashtags",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },

      {
        $limit: 8,
      },

      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
    ]);

    return trending;
  };
  // ====================================
// Community Analytics
// ====================================
export const getCommunityAnalyticsService =
  async () => {
    const [
      totalUsers,
      totalPosts,
      totalBookmarks,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Bookmark.countDocuments(),
    ]);

    return {
      totalUsers,
      totalPosts,
      totalBookmarks,
    };
  };