// services/user.service.ts
import axios from "axios";
import { User } from "@prisma/client";

export async function getUsers(): Promise<User[]> {
  const res = await axios.get("/api/users");

  return res.data.map((u: any) => ({
    id: u.id,
    username: u.username,
    email: u.email ?? undefined, // ✅ ubah null → undefined
    role: u.role,
    createdAt: u.createdAt,
  }));
}
