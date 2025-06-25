import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { UserRole, IndustryType, AccountStatus } from "@/types/auth";

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    // User role - determines access level and features available
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.FREE,
    },
    // Industry type for specialized features and UI
    industryType: {
      type: String,
      enum: Object.values(IndustryType),
      default: IndustryType.OTHER,
    },
    // Account status for admin management
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    // Company/Organization details
    company: {
      name: String,
      size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
      },
      website: String,
    },
    // Contact information
    phone: String,
    timezone: {
      type: String,
      default: 'UTC',
    },
    // Preferences
    preferences: {
      language: {
        type: String,
        default: 'en',
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto',
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value: string) {
        return value.includes("cus_");
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value: string) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
    // Vapi.ai related configuration
    vapi: {
      publicKey: String,
      privateKey: String,
      assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VapiAssistant' }],
      phoneNumbers: [String],
      usage: {
        monthlyMinutes: { type: Number, default: 0 },
        totalCalls: { type: Number, default: 0 },
        lastResetDate: { type: Date, default: Date.now },
      },
    },
    // Admin and audit fields
    lastLoginAt: Date,
    loginCount: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
    isTwoFactorEnabled: { type: Boolean, default: false },
    notes: String, // Admin notes
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema, "av_users");
