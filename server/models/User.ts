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
