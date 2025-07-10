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

export async function createUser(data: Partial<User>) {
  const res = await axios.post("/api/users", data);

  return res.data;
}

export async function getUserById(id: string): Promise<User> {
  const res = await axios.get(`/api/users/${id}`);

  return res.data;
}
