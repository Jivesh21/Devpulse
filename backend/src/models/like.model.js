import mongoose from "mongoose";

const { Schema, model } = mongoose;

const likeSchema = new Schema(
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

// ====================================
// Indexes
// ====================================

// One user can like one post only once
likeSchema.index(
  {
    user: 1,
    post: 1,
  },
  {
    unique: true,
  }
);

// Optimizes:
// Like.find({ post })
// Like.countDocuments({ post })
likeSchema.index({
  post: 1,
});

const Like = model("Like", likeSchema);

export default Like;