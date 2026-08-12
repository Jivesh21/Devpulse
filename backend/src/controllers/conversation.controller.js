import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createOrGetConversationService,
  getUserConversationsService,
  getConversationService,
} from "../services/conversation.service.js";

// ====================================
// Create or Get Direct Conversation
// ====================================
export const createOrGetConversation =
  asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const result =
      await createOrGetConversationService(
        req.user._id,
        userId
      );

    return res.status(
      result.created ? 201 : 200
    ).json(
      new ApiResponse(
        result.created ? 201 : 200,
        result,
        result.created
          ? "Conversation created successfully"
          : "Conversation fetched successfully"
      )
    );
  });

// ====================================
// Get Current User Conversations
// ====================================
export const getUserConversations =
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
    } = req.query;

    const result =
      await getUserConversationsService(
        req.user._id,
        page,
        limit
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Conversations fetched successfully"
      )
    );
  });

// ====================================
// Get Single Conversation
// ====================================
export const getConversation =
  asyncHandler(async (req, res) => {
    const { conversationId } =
      req.params;

    const conversation =
      await getConversationService(
        req.user._id,
        conversationId
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        conversation,
        "Conversation fetched successfully"
      )
    );
  });