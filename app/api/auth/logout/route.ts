import { NextResponse } from "next/server";

export async function POST() {
  // Hapus token dari cookie jika kamu menyimpannya di sana (opsional)
  const response = NextResponse.json({
    message: "Logout berhasil",
  });

  // Contoh: clear cookie (jika token disimpan di cookie)
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
