"use client";

import { useQuery } from "@tanstack/react-query";

import DashboardSuperAdmin from "./SuperAdmin/DashboardSuperAdmin";
import DashboardWarga from "./Warga/DashboardWarga";
import DashboardRT from "./RT/DashboardRT";
import DashboardStaff from "./Staff/DashboardStaff";
import DashboardLurah from "./Lurah/DashboardLurah";

import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getMe } from "@/services/authService";

export default function DashboardGrid() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isLoading) return <SkeletonCard rows={3} />;

  if (!user?.role) return <div>Gagal memuat peran pengguna.</div>;

  switch (user.role) {
    case "SUPERADMIN":
      return <DashboardSuperAdmin />;
    case "RT":
      return <DashboardRT />;
    case "WARGA":
      return <DashboardWarga />;
    case "STAFF":
      return <DashboardStaff />;
    case "LURAH":
      return <DashboardLurah />;
    default:
      return <div>Role tidak dikenali.</div>;
  }
}
