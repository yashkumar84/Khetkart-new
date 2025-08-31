import mongoose, { Schema, Document } from "mongoose";

export type PayoutStatus = "pending" | "approved" | "rejected";

export interface IPayout extends Document {
  user: Schema.Types.ObjectId;
  amount: number; // coins deducted
  method?: string; // e.g., UPI, bank
  details?: string; // account details
  status: PayoutStatus;
  createdAt: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    method: { type: String },
    details: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Payout = mongoose.models.Payout || mongoose.model<IPayout>("Payout", PayoutSchema);
