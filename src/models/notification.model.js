import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "follow",
        "like",
        "comment",
      ],
      required: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ====================================
// Indexes
// ====================================

// Fetch notifications for a user
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

// Fetch unread notifications
notificationSchema.index({
  recipient: 1,
  isRead: 1,
});

const Notification = model(
  "Notification",
  notificationSchema
);

export default Notification;