import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

// ====================================
// Create or Get Direct Conversation
// ====================================

export const createOrGetConversationService =
  async (
    currentUserId,
    targetUserId
  ) => {
    // ====================================
    // Prevent Self Conversation
    // ====================================

    if (
      currentUserId.toString() ===
      targetUserId.toString()
    ) {
      throw new ApiError(
        400,
        "You cannot start a conversation with yourself"
      );
    }

    // ====================================
    // Check Target User Exists
    // ====================================

    const targetUser =
      await User.findById(targetUserId);

    if (!targetUser) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    // ====================================
    // Check Existing Conversation
    // ====================================

    const existingConversation =
      await Conversation.findOne({
        participants: {
          $all: [
            currentUserId,
            targetUserId,
          ],
        },
      })
        .populate(
          "participants",
          "fullName username avatar"
        )
        .populate(
          "lastMessage",
          "sender content createdAt readBy"
        );

    // ====================================
    // Return Existing Conversation
    // ====================================

    if (existingConversation) {
      return {
        conversation:
          existingConversation,
        created: false,
      };
    }

    // ====================================
    // Create New Conversation
    // ====================================

    const conversation =
      await Conversation.create({
        participants: [
          currentUserId,
          targetUserId,
        ],
      });

    // ====================================
    // Populate Participants
    // ====================================

    await conversation.populate(
      "participants",
      "fullName username avatar"
    );

    return {
      conversation,
      created: true,
    };
  };

// ====================================
// Get User Conversations
// ====================================

export const getUserConversationsService =
  async (
    userId,
    page = 1,
    limit = 20
  ) => {
    // ====================================
    // Verify User
    // ====================================

    const user =
      await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    // ====================================
    // Pagination
    // ====================================

    const pageNumber =
      Math.max(Number(page), 1);

    const limitNumber =
      Math.min(
        Math.max(Number(limit), 1),
        50
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // ====================================
    // Fetch Conversations
    // ====================================

    const conversations =
      await Conversation.find({
        participants: userId,
      })
        .populate(
          "participants",
          "fullName username avatar"
        )
        .populate(
          "lastMessage",
          "sender content createdAt readBy"
        )
        .sort({
          lastMessageAt: -1,
          updatedAt: -1,
        })
        .skip(skip)
        .limit(limitNumber);

    // ====================================
    // Calculate Unread Counts
    // ====================================

    const conversationsWithUnreadCount =
      await Promise.all(
        conversations.map(
          async (conversation) => {
            const unreadCount =
              await Message.countDocuments({
                conversation:
                  conversation._id,

                sender: {
                  $ne: userId,
                },

                readBy: {
                  $ne: userId,
                },
              });

            return {
              ...conversation.toObject(),
              unreadCount,
            };
          }
        )
      );

    // ====================================
    // Total Conversations
    // ====================================

    const totalConversations =
      await Conversation.countDocuments({
        participants: userId,
      });

    // ====================================
    // Return Conversations
    // ====================================

    return {
      conversations:
        conversationsWithUnreadCount,

      totalConversations,

      currentPage:
        pageNumber,

      totalPages:
        Math.ceil(
          totalConversations /
            limitNumber
        ),
    };
  };

// ====================================
// Get Single Conversation
// ====================================

export const getConversationService =
  async (
    currentUserId,
    conversationId
  ) => {
    // ====================================
    // Find Conversation
    // ====================================

    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        participants: currentUserId,
      })
        .populate(
          "participants",
          "fullName username avatar"
        )
        .populate(
          "lastMessage",
          "sender content createdAt readBy"
        );

    if (!conversation) {
      throw new ApiError(
        404,
        "Conversation not found"
      );
    }

    // ====================================
    // Calculate Unread Count
    // ====================================

    const unreadCount =
      await Message.countDocuments({
        conversation:
          conversationId,

        sender: {
          $ne: currentUserId,
        },

        readBy: {
          $ne: currentUserId,
        },
      });

    // ====================================
    // Return Conversation
    // ====================================

    return {
      ...conversation.toObject(),
      unreadCount,
    };
  };