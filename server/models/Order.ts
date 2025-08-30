import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = "Placed" | "Confirmed" | "Out for delivery" | "Delivered" | "Cancelled";

export interface IOrderItem {
  product: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  discountTotal?: number;
  finalTotal: number;
  address: string;
  status: OrderStatus;
  assignedTo?: Types.ObjectId; // delivery partner
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [OrderItemSchema], required: true },
  total: { type: Number, required: true },
  discountTotal: { type: Number },
  finalTotal: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ["Placed", "Confirmed", "Out for delivery", "Delivered", "Cancelled"], default: "Placed", index: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
