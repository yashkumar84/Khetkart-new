import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "admin" | "farmer" | "delivery";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  address?: string;
  isActive: boolean;
  avatar?: string;
  resetToken?: string | null;
  resetExpires?: Date | null;
  coins: number;
  referralCode?: string | null;
  referredBy?: Schema.Types.ObjectId | null;
  requestedCode?: string | null;
  requestedCodeStatus?: "pending" | "approved" | "rejected" | null;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "farmer", "delivery"],
      default: "user",
      index: true,
    },
    address: { type: String },
    isActive: { type: Boolean, default: true },
    avatar: { type: String },
    resetToken: { type: String, default: null },
    resetExpires: { type: Date, default: null },
    coins: { type: Number, default: 0 },
    referralCode: { type: String, default: null, unique: true, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    requestedCode: { type: String, default: null },
    requestedCodeStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
