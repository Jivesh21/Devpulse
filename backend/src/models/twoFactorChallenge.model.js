import mongoose from "mongoose";

const { Schema, model } = mongoose;

const twoFactorChallengeSchema = new Schema(
  {
    // ====================================
    // User
    // ====================================
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ====================================
    // Hashed OTP
    // ====================================
    codeHash: {
      type: String,
      required: true,
    },

    // ====================================
    // Expiration
    // ====================================
  expiresAt: {
  type: Date,
  required: true,
},

    // ====================================
    // Verification Attempts
    // ====================================
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ====================================
// Automatically delete expired challenges
// ====================================
twoFactorChallengeSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const TwoFactorChallenge = model(
  "TwoFactorChallenge",
  twoFactorChallengeSchema
);

export default TwoFactorChallenge;