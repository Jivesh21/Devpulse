import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
import Follow from "../models/follow.model.js";
import Bookmark from "../models/bookmark.model.js";
import Notification from "../models/notification.model.js";

import AIConversation from "../models/aiConversation.model.js";
import AIUsage from "../models/aiUsage.model.js";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// ====================================
// Delete All User-Related Data
// ====================================

export const deleteUserRelatedData =
  async (userId) => {
    // ====================================
    // Delete User's Posts
    // ====================================

    await Post.deleteMany({
      author: userId,
    });

    // ====================================
    // Delete User's Likes
    // ====================================

    await Like.deleteMany({
      user: userId,
    });

    // ====================================
    // Remove User From Post Like Arrays
    // ====================================

    await Post.updateMany(
      {
        likes: userId,
      },
      {
        $pull: {
          likes: userId,
        },
      }
    );

    // ====================================
    // Delete User's Comments
    // ====================================

    await Comment.deleteMany({
      author: userId,
    });

    // ====================================
    // Delete User's Follows
    // ====================================

    await Follow.deleteMany({
      $or: [
        {
          follower: userId,
        },
        {
          following: userId,
        },
      ],
    });

    // ====================================
    // Delete User's Bookmarks
    // ====================================

    await Bookmark.deleteMany({
      user: userId,
    });

    // ====================================
    // Delete User's Notifications
    // ====================================

    await Notification.deleteMany({
      $or: [
        {
          recipient: userId,
        },
        {
          sender: userId,
        },
      ],
    });

    // ====================================
    // Delete User's AI Conversations
    // ====================================

    await AIConversation.deleteMany({
      user: userId,
    });

    // ====================================
    // Delete User's AI Usage
    // ====================================

    await AIUsage.deleteMany({
      user: userId,
    });

    // ====================================
    // Find User's Conversations
    // ====================================

    const conversations =
      await Conversation.find({
        participants: userId,
      }).select("_id");

    const conversationIds =
      conversations.map(
        (conversation) =>
          conversation._id
      );

    // ====================================
    // Delete User's Messages
    // ====================================

    if (conversationIds.length > 0) {
      await Message.deleteMany({
        conversation: {
          $in: conversationIds,
        },
      });

      // ====================================
      // Delete User's Conversations
      // ====================================

      await Conversation.deleteMany({
        _id: {
          $in: conversationIds,
        },
      });
    }
  };