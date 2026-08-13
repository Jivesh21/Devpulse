import mongoose from "mongoose";

// ====================================
// AI Usage Schema
// ====================================

const aiUsageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ====================================
    // Usage Date
    // ====================================

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // ====================================
    // Request Usage
    // ====================================

    requestCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // ====================================
    // Token Usage
    // ====================================

    inputTokens: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    outputTokens: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    totalTokens: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ====================================
// Model
// ====================================

const AIUsage = mongoose.model(
  "AIUsage",
  aiUsageSchema
);

export default AIUsage;