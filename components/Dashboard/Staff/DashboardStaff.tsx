"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { UserGroupIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import { getMe } from "@/services/authService";
import { getStaffDashboardStats } from "@/services/dashboardService";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { StatsCard } from "@/components/ui/StatsCard";
import NotificationGrid from "../Notification/NotificationGrid";

export default function DashboardStaff() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["staff-dashboard-stats", user?.id],
    queryFn: () => getStaffDashboardStats(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Staff</h1>
        {user && (
          <p className="text-default-600">
            Selamat datang,{" "}
            <span className="font-semibold">{user.username}</span> 👋
          </p>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <SkeletonCard rows={3} />
        ) : (
          <>
            <StatsCard
              title="Menunggu Review"
              value={stats?.menungguReview || 0}
              icon={<DocumentTextIcon className="w-6 h-6 text-warning" />}
              color="warning"
              action={
                <Button
                  size="sm"
                  color="warning"
                  onPress={() => router.push("/staff/surat")}
                >
                  Tinjau
                </Button>
              }
            />
            <StatsCard
              title="Sedang Diproses"
              value={stats?.sedangDiproses || 0}
              icon={<DocumentTextIcon className="w-6 h-6 text-primary" />}
              color="primary"
              action={
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => router.push("/staff/surat")}
                >
                  Proses
                </Button>
              }
            />
            <StatsCard
              title="Selesai Bulan Ini"
              value={stats?.totalSelesai || 0}
              icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
              color="success"
              action={
                <Button
                  size="sm"
                  color="success"
                  onPress={() => router.push("/staff/surat")}
                >
                  Lihat Semua
                </Button>
              }
            />
          </>
        )}
      </div>

      {/* 🔔 Notifikasi */}
      <div className="mt-6">
        <NotificationGrid getMeData={user} />
      </div>
    </div>
  );
}
