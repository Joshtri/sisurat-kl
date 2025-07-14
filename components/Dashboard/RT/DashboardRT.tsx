"use client";

import { DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { StatsCard } from "@/components/ui/StatsCard";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getRTDashboardStats } from "@/services/dashboardService";
import { getMe } from "@/services/authService";
import NotificationGrid from "../Notification/NotificationGrid";

export default function DashboardRT() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["rt-dashboard-stats", user?.id],
    queryFn: () => getRTDashboardStats(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard RT</h1>
        {user && (
          <p className="text-default-600">
            Selamat datang,{" "}
            <span className="font-semibold">{user.username}</span> 👋
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {isLoading ? (
          <SkeletonCard rows={3} />
        ) : (
          <>
            <StatsCard
              title="Total Warga RT"
              value={stats?.totalWarga || 0}
              icon={<UserGroupIcon className="w-6 h-6 text-primary" />}
              color="primary"
              action={
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => router.push("/rt/warga")}
                >
                  Lihat Warga
                </Button>
              }
            />

            <StatsCard
              title="Surat Masuk"
              value={stats?.totalSuratMasuk || 0}
              icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
              color="success"
              action={
                <Button
                  size="sm"
                  color="success"
                  onPress={() => router.push("/rt/pengajuan")}
                >
                  Lihat Surat
                </Button>
              }
            />

            <StatsCard
              title="Surat Diverifikasi"
              value={stats?.totalSuratVerified || 0}
              icon={<DocumentTextIcon className="w-6 h-6 text-warning" />}
              color="warning"
              action={
                <Button
                  size="sm"
                  color="warning"
                  onPress={() => router.push("/rt/pengajuan")}
                >
                  Lihat Hasil
                </Button>
              }
            />
          </>
        )}
      </div>

      {/* 🔔 Panggil komponen NotificationGrid di bawah statistik */}
      <div className="mt-6">
        <NotificationGrid getMeData={user} />
      </div>
    </>
  );
}
