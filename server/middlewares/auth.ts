import { RequestHandler } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthedRequest extends Request {
  user?: { id: string; role: "user" | "admin" | "farmer" | "delivery" };
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  try {
    const payload = verifyJwt<{ sub: string; role: AuthedRequest["user"]["role"] }>(token);
    (req as AuthedRequest).user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (...roles: Array<AuthedRequest["user"]["role"]>): RequestHandler => {
  return (req, res, next) => {
    const user = (req as AuthedRequest).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
