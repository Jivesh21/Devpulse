import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    // ====================================
    // Conversation
    // ====================================

    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    // ====================================
    // Sender
    // ====================================

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ====================================
    // Message Content
    // ====================================

    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [
        5000,
        "Message cannot exceed 5000 characters",
      ],
    },

    // ====================================
    // Read Status
    // ====================================

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ====================================
// Index For Message History
// ====================================

messageSchema.index({
  conversation: 1,
  createdAt: -1,
});

const Message = model(
  "Message",
  messageSchema
);

export default Message;