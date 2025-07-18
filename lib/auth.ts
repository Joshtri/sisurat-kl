import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// Type deklarasi payload token
export interface TokenPayload {
  id: string;
  sub: string; // user id
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// Verifikasi password
export function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

// Generate JWT token
export function generateToken(user: User) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );
}

// Verifikasi JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    return decoded;
  } catch (error) {
    console.error("Token tidak valid:", error);

    return null;
  }
}

// Redirect role-based
export function getRedirectPathByRole(role: Role): string {
  switch (role) {
    case "SUPERADMIN":
      return "/superadmin/dashboard";
    case "LURAH":
      return "/lurah/dashboard";
    case "STAFF":
      return "/staff/dashboard";
    case "RT":
      return "/rt/dashboard";
    default:
      return "/warga/dashboard";
  }
}
