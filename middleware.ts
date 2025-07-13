import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  let userRole: string | undefined = undefined;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      userRole = decoded.role;
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  // Always allow static files and API
  const isApi = pathname.startsWith("/api");
  const isStatic = pathname.includes(".");
  if (isApi || isStatic) return NextResponse.next();

  // Check current maintenance status
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/maintenance`
  );
  const { isMaintenance } = await res.json();

  const isSuperadmin = userRole === "superadmin";

  // --- Blokir akses halaman biasa jika maintenance aktif ---
  if (isMaintenance && !isSuperadmin && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // --- Cegah akses ke /maintenance jika sistem sudah normal ---
  if (!isMaintenance && pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url)); // redirect ke homepage atau dashboard
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
