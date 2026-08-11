import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema, model } = mongoose;

const SALT_ROUNDS = 10;

const userSchema = new Schema(
  {
    // ====================================
    // Basic User Information
    // ====================================
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [
        3,
        "Full name must be at least 3 characters",
      ],
      maxlength: [
        50,
        "Full name cannot exceed 50 characters",
      ],
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [
        3,
        "Username must be at least 3 characters",
      ],
      maxlength: [
        20,
        "Username cannot exceed 20 characters",
      ],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },

    // ====================================
    // Email Verification
    // ====================================
    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // ====================================
    // Authentication
    // ====================================
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: [
        8,
        "Password must be at least 8 characters long",
      ],
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ====================================
    // Two-Factor Authentication
    // ====================================
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    // ====================================
    // Profile
    // ====================================
    bio: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

   githubIntegration: {
  connected: {
    type: Boolean,
    default: false,
  },

  githubId: {
    type: String,
    default: "",
  },

  username: {
    type: String,
    default: "",
  },

  accessToken: {
    type: String,
    select: false,
    default: "",
  },

  connectedAt: {
    type: Date,
    default: null,
  },
},
    // ====================================
    // Education
    // ====================================
    education: [
      {
        institution: String,

        degree: String,

        fieldOfStudy: String,

        startDate: Date,

        endDate: Date,

        grade: String,

        description: String,
      },
    ],

    // ====================================
    // Certificates
    // ====================================
    certificates: [
      {
        title: String,

        issuer: String,

        issueDate: Date,

        credentialUrl: String,

        image: String,
      },
    ],

    // ====================================
    // Resume
    // ====================================
    resume: {
      type: String,
      default: "",
    },

    // ====================================
    // Refresh Token
    // ====================================
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ====================================
// Hash Password Before Save
// ====================================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(
    this.password,
    SALT_ROUNDS
  );
});

// ====================================
// Compare Password
// ====================================
userSchema.methods.isPasswordCorrect = async function (
  password
) {
  return bcrypt.compare(
    password,
    this.password
  );
};

// ====================================
// Generate Access Token
// ====================================
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// ====================================
// Generate Refresh Token
// ====================================
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = model("User", userSchema);

export default User;