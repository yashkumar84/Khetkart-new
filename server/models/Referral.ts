import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
  code: string;
  referrer: Schema.Types.ObjectId; // User who owns the code
  referred: Schema.Types.ObjectId; // New user who applied the code
  rewardReferrer: number;
  rewardReferred: number;
  createdAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    code: { type: String, required: true, index: true },
    referrer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    referred: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rewardReferrer: { type: Number, required: true },
    rewardReferred: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Referral =
  mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", ReferralSchema);
