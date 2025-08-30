import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountPercent: number; // 0-100
  isActive: boolean;
  expiresAt?: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

export const Coupon =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
