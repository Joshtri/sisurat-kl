// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyToken } from "@/lib/auth";

// export async function GET(req: NextRequest) {
//   const authHeader = req.headers.get("authorization");
//   const token = authHeader?.replace("Bearer ", "");

//   if (!token) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const payload = verifyToken(token);
//   if (!payload) {
//     return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//   }

//   try {
//     const notifications = await prisma.notification.findMany({
//       where: {
//         targetRole: payload.role, // hanya notifikasi untuk role user tersebut
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json(notifications);
//   } catch (error) {
//     console.error("[NOTIFICATION_GET_ERROR]", error);
//     return NextResponse.json(
//       { message: "Gagal mengambil notifikasi" },
//       { status: 500 }
//     );
//   }
// }
