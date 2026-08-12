import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  sendMessageService,
  getConversationMessagesService,
  markConversationAsReadService,
} from "../services/message.service.js";

// ====================================
// Send Message
// ====================================

export const sendMessage =
  asyncHandler(async (req, res) => {
    const {
      conversationId,
      content,
    } = req.body;

    // ====================================
    // Save Message
    // ====================================

    const message =
      await sendMessageService(
        req.user._id,
        conversationId,
        content
      );

    // ====================================
    // Response
    // ====================================

    return res.status(201).json(
      new ApiResponse(
        201,
        message,
        "Message sent successfully"
      )
    );
  });

// ====================================
// Get Conversation Messages
// ====================================

export const getConversationMessages =
  asyncHandler(async (req, res) => {
    const {
      conversationId,
    } = req.params;

    const {
      page = 1,
      limit = 30,
    } = req.query;

    const result =
      await getConversationMessagesService(
        req.user._id,
        conversationId,
        page,
        limit
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Messages fetched successfully"
      )
    );
  });

// ====================================
// Mark Conversation As Read
// ====================================

export const markConversationAsRead =
  asyncHandler(async (req, res) => {
    const {
      conversationId,
    } = req.params;

    const result =
      await markConversationAsReadService(
        req.user._id,
        conversationId
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Conversation marked as read"
      )
    );
  });