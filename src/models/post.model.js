import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post author is required"],
      index: true,
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

const Post = model("Post", postSchema);

export default Post;