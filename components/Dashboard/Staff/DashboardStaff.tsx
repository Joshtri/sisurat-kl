"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import NotificationGrid from "../Notification/NotificationGrid";
import { getMe } from "@/services/authService";
import { getStaffDashboardStats } from "@/services/dashboardService";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { StatsCard } from "@/components/ui/StatsCard";

const STATUS_COLORS: Record<string, string> = {
  DITERBITKAN: "#22c55e",
  DITOLAK_LURAH: "#ef4444",
  DIVERIFIKASI_LURAH: "#3b82f6",
};

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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Staff</h1>
        {user && (
          <p className="text-default-600">
            Selamat datang,{" "}
            <span className="font-semibold">{user.username}</span> 👋
          </p>
        )}
      </div>

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
                  onPress={() => router.push("/staff/pengajuan")}
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
                  onPress={() => router.push("/staff/pengajuan")}
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
                  onPress={() => router.push("/staff/pengajuan")}
                >
                  Lihat Semua
                </Button>
              }
            />
          </>
        )}
      </div>

      {/* 📊 Charts Section */}
      {!isLoading && stats?.chartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Pie Chart by Status */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">
              Distribusi Status Surat
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.chartData.byStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.chartData.byStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart per Month */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">
              Jumlah Surat per Bulan
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.chartData.perMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-6">
        <NotificationGrid getMeData={user} />
      </div>
    </div>
  );
}
