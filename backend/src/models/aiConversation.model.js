import mongoose from "mongoose";

// ====================================
// AI Message Schema
// ====================================

const aiMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ====================================
// AI Conversation Schema
// ====================================

const aiConversationSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      messages: {
        type: [aiMessageSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

// ====================================
// Model
// ====================================

const AIConversation =
  mongoose.model(
    "AIConversation",
    aiConversationSchema
  );

export default AIConversation;