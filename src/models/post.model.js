import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post author is required"],
    },

    content: {
      type: String,
      trim: true,
      maxlength: [5000, "Post cannot exceed 5000 characters"],
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    hashtags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

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

// Optimizes feed queries:
// Post.find({ author: { $in: [...] } }).sort({ createdAt: -1 })
postSchema.index({
  author: 1,
  createdAt: -1,
});

// Optimizes hashtag searches
postSchema.index({
  hashtags: 1,
});

const Post = model("Post", postSchema);

export default Post;