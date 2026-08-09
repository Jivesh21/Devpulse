import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    // ====================================
    // Author
    // ====================================

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post author is required"],
    },

    // ====================================
    // Content
    // ====================================

    content: {
      type: String,
      trim: true,
      maxlength: [
        5000,
        "Post cannot exceed 5000 characters",
      ],
      default: "",
    },

    // ====================================
    // Image
    // ====================================

    image: {
      type: String,
      default: "",
    },

    // ====================================
    // Hashtags
    // ====================================

    hashtags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // ====================================
    // Likes
    // ====================================

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ====================================
    // Edit Status
    // ====================================

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

// Feed queries
postSchema.index({
  author: 1,
  createdAt: -1,
});

// Hashtag searches
postSchema.index({
  hashtags: 1,
});

// Like-related queries
postSchema.index({
  likes: 1,
});

const Post = model("Post", postSchema);

export default Post;