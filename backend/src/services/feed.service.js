import Follow from "../models/follow.model.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
// ====================================
// Get User Feed
// ====================================
export const getFeedService = async (
  userId,
  page = 1,
  limit = 10
) => {
  // Get users that current user follows
  const following = await Follow.find({
    follower: userId,
  }).select("following");

  // Convert documents into array of ids
  const followingIds = following.map(
    (follow) => follow.following
  );

  // Include current user's posts
  followingIds.push(userId);

  // Pagination
  const skip =
    (Number(page) - 1) * Number(limit);

  // Fetch feed posts
const posts = await Post.find({
  author: {
    $in: followingIds,
  },
})
  .populate(
    "author",
    "fullName username avatar"
  )
  .sort({
    createdAt: -1,
  })
  .skip(skip)
  .limit(Number(limit));

const postsWithLikes = await Promise.all(
  posts.map(async (post) => {
    const likesCount = await Like.countDocuments({
      post: post._id,
    });

    const commentsCount =
      await Comment.countDocuments({
        post: post._id,
      });

const isLiked = await Like.exists({
  post: post._id,
  user: userId,
});

const isFollowingAuthor = await Follow.exists({
  follower: userId,
  following: post.author._id,
});

return {
  ...post.toObject(),
  likesCount,
  commentsCount,
  isLiked: !!isLiked,
  isFollowingAuthor: !!isFollowingAuthor,
};
  })
);
  // Total feed posts
  const totalPosts =
    await Post.countDocuments({
      author: {
        $in: followingIds,
      },
    });

  return {
  posts: postsWithLikes,
  totalPosts,
  currentPage: Number(page),
  totalPages: Math.ceil(
    totalPosts / Number(limit)
  ),
};
};