import mongoose, { Schema } from "mongoose";

const portfolioSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    coverImage: {
      type: String,
      default: "",
    },

    techStack: [
      {
        type: String,
        trim: true,
      },
    ],

    githubUrl: {
      type: String,
      default: "",
    },

    liveUrl: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Portfolio = mongoose.model(
  "Portfolio",
  portfolioSchema
);