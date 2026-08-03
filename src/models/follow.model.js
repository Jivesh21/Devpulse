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

// Prevent duplicate follows
followSchema.index(
  { follower: 1, following: 1 },
  { unique: true }
);

const Follow = model("Follow", followSchema);

export default Follow;