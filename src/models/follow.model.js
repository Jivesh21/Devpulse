import mongoose from "mongoose";

const { Schema, model } = mongoose;

const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

// Prevent duplicate follows
followSchema.index(
  {
    follower: 1,
    following: 1,
  },
  {
    unique: true,
  }
);

// Followers queries
followSchema.index({
  following: 1,
});

// Following queries
followSchema.index({
  follower: 1,
});

const Follow = model("Follow", followSchema);

export default Follow;