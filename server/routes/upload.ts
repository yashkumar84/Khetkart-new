import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const uploadDir = path.resolve(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post("/image", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
