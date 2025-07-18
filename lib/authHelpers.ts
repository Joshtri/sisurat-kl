import { NextRequest } from "next/server";

import { verifyToken, TokenPayload } from "@/lib/auth";

export function getAuthUserFromRequest(req: NextRequest): {
  user: TokenPayload | null;
  error: string | null;
  status: number;
} {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { user: null, error: "Unauthorized", status: 401 };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return { user: null, error: "Invalid token", status: 401 };
  }

  return { user: payload, error: null, status: 200 };
}
