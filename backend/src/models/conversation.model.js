import mongoose from "mongoose";

const { Schema, model } = mongoose;

const conversationSchema = new Schema(
  {
    // ====================================
    // Participants
    // ====================================

    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],

      required: true,

      validate: {
        validator: function (participants) {
          if (!Array.isArray(participants)) {
            return false;
          }

          return participants.length === 2;
        },

        message:
          "A direct conversation must have exactly two participants",
      },
    },

    // ====================================
    // Last Message
    // ====================================

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ====================================
// Prevent Self Conversation
// ====================================

conversationSchema.path(
  "participants"
).validate({
  validator: function (participants) {
    if (
      !Array.isArray(participants) ||
      participants.length !== 2
    ) {
      return true;
    }

    return (
      participants[0].toString() !==
      participants[1].toString()
    );
  },

  message:
    "A user cannot have a conversation with themselves",
});

const Conversation = model(
  "Conversation",
  conversationSchema
);

export default Conversation;