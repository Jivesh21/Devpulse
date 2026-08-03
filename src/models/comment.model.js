import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    isEdited: {
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

// Optimizes:
// Comment.find({ post })
// Comment.countDocuments({ post })
commentSchema.index({
  post: 1,
});

// Optimizes replies (future feature)
commentSchema.index({
  parentComment: 1,
});

const Comment = model("Comment", commentSchema);

export default Comment;