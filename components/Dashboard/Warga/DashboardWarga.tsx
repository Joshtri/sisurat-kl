"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DocumentTextIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { StatsCard } from "@/components/ui/StatsCard";
import { getMe } from "@/services/authService";
import { getWargaDashboardStats } from "@/services/dashboardService";

export default function DashboardWarga() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["warga-dashboard-stats", user?.id],
    queryFn: () => getWargaDashboardStats(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Warga</h1>
        {user && (
          <p className="text-default-600">
            Selamat datang,{" "}
            <span className="font-semibold">{user.username}</span> 👋
          </p>
        )}

        <div className="mt-6">
          <Button
            color="primary"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={() => router.push("/warga/permohonan/create")}
          >
            Ajukan Surat Baru
          </Button>
        </div>
      </div>

      {/* Statistik singkat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Surat Diajukan"
          value={stats?.totalSuratMasuk || 0}
          isLoading={isLoading}
          icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
          color="success"
        />
        <StatsCard
          title="Surat Diverifikasi Lurah"
          value={stats?.totalSuratVerified || 0}
          isLoading={isLoading}
          icon={<DocumentTextIcon className="w-6 h-6 text-warning" />}
          color="warning"
        />
        <StatsCard
          title="Surat Ditolak"
          value={stats?.totalSuratRejected || 0}
          isLoading={isLoading}
          icon={<DocumentTextIcon className="w-6 h-6 text-danger" />}
          color="danger"
        />
      </div>

      {/* Chart Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            Distribusi Surat per Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.chartData?.byStatus || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Per Bulan */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            Jumlah Surat Diajukan per Bulan
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.chartData?.perMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#82ca9d"
                name="Jumlah"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
