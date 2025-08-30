import mongoose, { Schema, Document, Types } from "mongoose";

export type Category = "Vegetables" | "Fruits" | "Milk" | "Crops" | "Others";

export interface IProduct extends Document {
  title: string;
  description?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  category: Category;
  isPublished: boolean;
  createdBy?: Types.ObjectId; // farmer/admin
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true, index: "text" },
  description: { type: String },
  images: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  stock: { type: Number, default: 0 },
  category: { type: String, enum: ["Vegetables", "Fruits", "Milk", "Crops", "Others"], required: true, index: true },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
