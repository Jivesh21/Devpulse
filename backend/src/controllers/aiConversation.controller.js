import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import AIConversation from "../models/aiConversation.model.js";

// ====================================
// Create AI Conversation
// ====================================

export const createAIConversation =
  asyncHandler(async (req, res) => {
    const conversation =
      await AIConversation.create({
        user: req.user._id,
        title: "New AI Chat",
        messages: [],
      });

    return res.status(201).json({
      success: true,
      message:
        "AI conversation created successfully",
      data: conversation,
    });
  });

// ====================================
// Get User AI Conversations
// ====================================

export const getAIConversations =
  asyncHandler(async (req, res) => {
    const conversations =
      await AIConversation.find({
        user: req.user._id,
      })
        .select(
          "_id title createdAt updatedAt messages"
        )
        .sort({
          updatedAt: -1,
        });

    return res.status(200).json({
      success: true,
      message:
        "AI conversations fetched successfully",
      data: conversations,
    });
  });

// ====================================
// Get Single AI Conversation
// ====================================

export const getAIConversation =
  asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    const conversation =
      await AIConversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

    if (!conversation) {
      throw new ApiError(
        404,
        "AI conversation not found"
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "AI conversation fetched successfully",
      data: conversation,
    });
  });

// ====================================
// Delete AI Conversation
// ====================================

export const deleteAIConversation =
  asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    // ====================================
    // Find Conversation Owned By User
    // ====================================

    const conversation =
      await AIConversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

    // ====================================
    // Conversation Not Found
    // ====================================

    if (!conversation) {
      throw new ApiError(
        404,
        "AI conversation not found"
      );
    }

    // ====================================
    // Delete Conversation
    // ====================================

    await AIConversation.deleteOne({
      _id: conversationId,
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "AI conversation deleted successfully",
    });
  });