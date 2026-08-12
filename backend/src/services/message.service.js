import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import ApiError from "../utils/ApiError.js";
import { getIO } from "../socket/index.js";

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

  const trimmedContent =
    content.trim();

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

  // ====================================
  // Emit Real-Time Message
  // ====================================

  if (recipient) {
    const io = getIO();

    io.to(
      `user:${recipient.toString()}`
    ).emit(
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

// ====================================
// Mark Conversation As Read
// ====================================

export const markConversationAsReadService =
  async (
    currentUserId,
    conversationId
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
    // Mark Received Messages As Read
    // ====================================

    const result =
      await Message.updateMany(
        {
          conversation:
            conversationId,

          sender: {
            $ne: currentUserId,
          },

          readBy: {
            $ne: currentUserId,
          },
        },
        {
          $addToSet: {
            readBy: currentUserId,
          },
        }
      );

    // ====================================
    // Find Other Participant
    // ====================================

    const otherParticipant =
      conversation.participants.find(
        (participant) =>
          participant.toString() !==
          currentUserId.toString()
      );

    // ====================================
    // Emit Read Receipt
    // ====================================

    if (
      otherParticipant &&
      result.modifiedCount > 0
    ) {
      const io = getIO();

      io.to(
        `user:${otherParticipant.toString()}`
      ).emit(
        "messages_read",
        {
          conversationId:
            conversationId.toString(),

          readerId:
            currentUserId.toString(),

          markedAsRead:
            result.modifiedCount,
        }
      );

      console.log(
        `👁️ Messages read in conversation:${conversationId}`
      );

      console.log(
        `📡 Read receipt emitted to user:${otherParticipant.toString()}`
      );
    }

    // ====================================
    // Return Result
    // ====================================

    return {
      conversationId,

      markedAsRead:
        result.modifiedCount,
    };
  };