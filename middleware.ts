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
  let isMaintenance = false; // Default to false in case of error
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/maintenance`,
      {
        cache: 'no-store', // Prevent caching to get fresh maintenance status
      }
    );
    
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        isMaintenance = data.isMaintenance;
      } else {
        // If response is not JSON, log error but continue with default value
        console.warn('Maintenance API did not return JSON:', await res.text());
      }
    } else {
      console.warn('Maintenance API request failed with status:', res.status);
    }
  } catch (error) {
    console.error('Error fetching maintenance status:', error);
  }

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
