// services/user.service.ts
import axios from "axios";

import { Users } from "@/interfaces/users";
// import { User } from "@prisma/client";

export async function getUsers(): Promise<Users[]> {
  const res = await axios.get("/api/users");

  return res.data;
}

export async function createUser(data: Partial<Users>) {
  const res = await axios.post("/api/users", data);

  return res.data;
}

export async function getUserById(id: string): Promise<Users> {
  const res = await axios.get(`/api/users/${id}`);

  return res.data;
}

export async function deleteUser(id: string): Promise<void> {
  await axios.delete(`/api/users/${id}`);
}

export async function updateUser(data: Partial<Users> & { id: string }) {
  const res = await axios.patch(`/api/users/${data.id}`, data);

  return res.data;
}

export async function updateUserRoles(userId: string, extraRoles: string[]) {
  try {
    const response = await axios.patch(`/api/users/${userId}/update-roles`, {
      extraRoles,
    });

    return response.data; // { message, user }
  } catch (error: any) {
    const message =
      error.response?.data?.error || "Gagal memperbarui role pengguna.";

    throw new Error(message);
  }
}
