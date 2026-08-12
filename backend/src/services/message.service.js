import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import ApiError from "../utils/ApiError.js";
import { getIO } from "../socket/index.js";

// ====================================
// Send Message
// ====================================

// ====================================
// Send Message
// ====================================
export const sendMessageService = async (
  currentUserId,
  conversationId,
  content
) => {
  // ====================================
  // Validate Content
  // ====================================

  if (!content || !content.trim()) {
    throw new ApiError(
      400,
      "Message content is required"
    );
  }

  const trimmedContent = content.trim();

  // ====================================
  // Find Conversation
  // ====================================

  const conversation =
    await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId,
    });

  if (!conversation) {
    throw new ApiError(
      404,
      "Conversation not found"
    );
  }

  // ====================================
  // Create Message
  // ====================================

  const message =
    await Message.create({
      conversation: conversationId,
      sender: currentUserId,
      content: trimmedContent,
      readBy: [currentUserId],
    });

  // ====================================
  // Update Conversation
  // ====================================

  conversation.lastMessage =
    message._id;

  conversation.lastMessageAt =
    message.createdAt;

  await conversation.save();

  // ====================================
  // Populate Message
  // ====================================

  await message.populate(
    "sender",
    "fullName username avatar"
  );

  // ====================================
  // Find Recipient
  // ====================================

  const recipient =
    conversation.participants.find(
      (participant) =>
        participant.toString() !==
        currentUserId.toString()
    );

  if (recipient) {
    // ====================================
    // Emit Real-Time Message
    // ====================================

    getIO()
      .to(`user:${recipient.toString()}`)
      .emit(
        "new_message",
        message
      );

    console.log(
      `💬 New message emitted to user:${recipient.toString()}`
    );
  }

  return message;
};

// ====================================
// Get Conversation Messages
// ====================================

export const getConversationMessagesService =
  async (
    currentUserId,
    conversationId,
    page = 1,
    limit = 30
  ) => {
    // ====================================
    // Verify Conversation Access
    // ====================================

    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        participants: currentUserId,
      });

    if (!conversation) {
      throw new ApiError(
        404,
        "Conversation not found"
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
        100
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // ====================================
    // Fetch Messages
    // ====================================

    const messages =
      await Message.find({
        conversation: conversationId,
      })
        .populate(
          "sender",
          "fullName username avatar"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber);

    // ====================================
    // Total Messages
    // ====================================

    const totalMessages =
      await Message.countDocuments({
        conversation: conversationId,
      });

    // ====================================
    // Return Messages
    // ====================================

    return {
      messages: messages.reverse(),

      totalMessages,

      currentPage: pageNumber,

      totalPages: Math.ceil(
        totalMessages /
          limitNumber
      ),
    };
  };