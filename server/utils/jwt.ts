import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string; // user id
  role: "user" | "admin" | "farmer" | "delivery";
}

const SECRET = process.env.JWT_SECRET || "dev-secret-change";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyJwt<T extends object = JwtPayload>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
