import { Router } from "express";
import { User } from "../models/User";
import { Product } from "../models/Product";

const router = Router();

router.post("/full", async (_req, res) => {
  // Seed users (same as /auth/seed-demo but idempotent)
  const demos = [
    {
      name: "Admin",
      email: "admin@khetkart.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "User",
      email: "user@khetkart.com",
      password: "user123",
      role: "user",
    },
    {
      name: "Delivery",
      email: "delivery@khetkart.com",
      password: "delivery123",
      role: "delivery",
    },
    {
      name: "Farmer",
      email: "farmer@khetkart.com",
      password: "farmer123",
      role: "farmer",
    },
  ] as const;
  for (const d of demos) {
    const exists = await User.findOne({ email: d.email });
    if (!exists) await User.create(d as any);
  }
  const admin = await User.findOne({ email: "admin@khetkart.com" });
  const farmer = await User.findOne({ email: "farmer@khetkart.com" });

  // Seed products
  const count = await Product.countDocuments();
  if (count < 12) {
    const base = [
      {
        title: "Fresh Tomatoes",
        category: "Vegetables",
        price: 40,
        discountPrice: 30,
        stock: 200,
        images: [
          "https://images.unsplash.com/photo-1546470427-e2dfa28a5b89?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Organic Potatoes",
        category: "Vegetables",
        price: 35,
        discountPrice: 28,
        stock: 300,
        images: [
          "https://images.unsplash.com/photo-1604908554027-912caca4b9c2?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Bananas (Dozen)",
        category: "Fruits",
        price: 60,
        discountPrice: 45,
        stock: 150,
        images: [
          "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Alphonso Mangoes",
        category: "Fruits",
        price: 300,
        discountPrice: 249,
        stock: 80,
        images: [
          "https://images.unsplash.com/photo-1615486363876-9f4a3e35c95a?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Full Cream Milk (1L)",
        category: "Milk",
        price: 65,
        discountPrice: 58,
        stock: 500,
        images: [
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Farm Paneer (200g)",
        category: "Milk",
        price: 95,
        discountPrice: 85,
        stock: 250,
        images: [
          "https://images.unsplash.com/photo-1586024044905-8fcb9efb1435?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Wheat (5kg)",
        category: "Crops",
        price: 220,
        discountPrice: 199,
        stock: 120,
        images: [
          "https://images.unsplash.com/photo-1592853625600-6b0a305f2f5a?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Rice (5kg)",
        category: "Crops",
        price: 350,
        discountPrice: 319,
        stock: 100,
        images: [
          "https://images.unsplash.com/photo-1509440159598-8b09d1e8be0d?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Fresh Spinach",
        category: "Vegetables",
        price: 25,
        discountPrice: 20,
        stock: 180,
        images: [
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Strawberries (250g)",
        category: "Fruits",
        price: 120,
        discountPrice: 99,
        stock: 90,
        images: [
          "https://images.unsplash.com/photo-1437750769465-301382cdf094?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Organic Ghee (500ml)",
        category: "Milk",
        price: 499,
        discountPrice: 449,
        stock: 60,
        images: [
          "https://images.unsplash.com/photo-1599785209793-d8238a2cf8b4?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        title: "Maize (5kg)",
        category: "Crops",
        price: 240,
        discountPrice: 219,
        stock: 110,
        images: [
          "https://images.unsplash.com/photo-1563483385596-2a8bff5b6b7c?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ];
    await Product.insertMany(
      base.map((p) => ({
        ...p,
        isPublished: true,
        createdBy: farmer?._id || admin?._id,
      })),
    );
  }

  res.json({ ok: true });
});

export default router;
