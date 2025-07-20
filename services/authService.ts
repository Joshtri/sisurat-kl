import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface LoginPayload {
  nik: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  role: string;
  redirect: string;
  userId?: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axios.post("/api/auth/login", payload);

  return res.data;
}
export async function getMe() {
  const token = localStorage.getItem("token"); // ambil token
  const res = await axios.get("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export const queryClient = new QueryClient();

export async function logout(): Promise<void> {
  await axios.post("/api/auth/logout");
  localStorage.removeItem("token");
  queryClient.clear(); // 🚨 PENTING agar dashboard lama tidak nyangkut
}
