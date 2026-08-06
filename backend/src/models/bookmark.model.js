import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bookmarkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// A user can bookmark a post only once
bookmarkSchema.index(
  {
    user: 1,
    post: 1,
  },
  {
    unique: true,
  }
);

const Bookmark = model(
  "Bookmark",
  bookmarkSchema
);

export default Bookmark;