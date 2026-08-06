import Bookmark from "../models/bookmark.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";

// ====================================
// Toggle Bookmark
// ====================================
export const toggleBookmarkService = async (
  userId,
  postId
) => {
  // Check if post exists
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if bookmark already exists
  const existingBookmark = await Bookmark.findOne({
    user: userId,
    post: postId,
  });

  // Remove Bookmark
  if (existingBookmark) {
    await Bookmark.findByIdAndDelete(
      existingBookmark._id
    );

    return {
      bookmarked: false,
    };
  }

  // Create Bookmark
  await Bookmark.create({
    user: userId,
    post: postId,
  });

  return {
    bookmarked: true,
  };
};

// ====================================
// Get Bookmarked Posts
// ====================================
export const getBookmarkedPostsService =
  async (userId) => {
    const bookmarks = await Bookmark.find({
      user: userId,
    })
      .populate({
        path: "post",
        populate: {
          path: "author",
          select:
            "fullName username avatar",
        },
      })
      .sort({
        createdAt: -1,
      });

    return bookmarks;
  };

// ====================================
// Get Bookmark Status
// ====================================
export const getBookmarkStatusService =
  async (userId, postId) => {
    const bookmark =
      await Bookmark.findOne({
        user: userId,
        post: postId,
      });

    return {
      bookmarked: !!bookmark,
    };
  };