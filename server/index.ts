import "dotenv/config";
import express, { RequestHandler } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectMongo } from "./db";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import userRoutes from "./routes/users";
import seedRoutes from "./routes/seed";
import farmerRoutes from "./routes/farmer";
import deliveryRoutes from "./routes/delivery";
import couponRoutes from "./routes/coupons";
import uploadRoutes from "./routes/upload";

const ensureDb: RequestHandler = async (_req, res, next) => {
  if (!process.env.MONGODB_URI) {
    return res
      .status(503)
      .json({ message: "Database not configured", dbConfigured: false });
  }
  try {
    if (!(global as any).__mongoConnected) {
      await connectMongo();
      (global as any).__mongoConnected = true;
    }
    next();
  } catch (e: any) {
    return res
      .status(503)
      .json({ message: e?.message || "Database unavailable" });
  }
};

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health & example routes (no DB required)
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      dbConfigured: Boolean(process.env.MONGODB_URI),
      env: "dev",
    });
  });

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Static files for uploads
  app.use("/uploads", express.static("public/uploads"));

  // KhetKart API (DB required)
  app.use("/api/auth", ensureDb, authRoutes);
  app.use("/api/products", ensureDb, productRoutes);
  app.use("/api/orders", ensureDb, orderRoutes);
  app.use("/api/users", ensureDb, userRoutes);
  app.use("/api/seed", ensureDb, seedRoutes);
  app.use("/api/farmer", ensureDb, farmerRoutes);
  app.use("/api/delivery", ensureDb, deliveryRoutes);
  app.use("/api/coupons", ensureDb, couponRoutes);
  app.use("/api/upload", ensureDb, uploadRoutes);

  return app;
}
