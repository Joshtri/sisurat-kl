"use client";

import { DocumentTextIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { StatsCard } from "@/components/ui/StatsCard";
import { getMe } from "@/services/authService";
import {
    getWargaDashboardStats
} from "@/services/dashboardService";

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
    <>
      <div className="flex flex-col gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <StatsCard
          title="Surat Diajukan"
          value={stats?.totalSuratMasuk || 0}
          isLoading={isLoading}
          icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
          color="success"
          action={
            !isLoading && (
              <Button
                size="sm"
                color="success"
                onPress={() => router.push("/warga/surat")}
              >
                Lihat Surat
              </Button>
            )
          }
        />

        <StatsCard
          title="Surat Diverifikasi"
          value={stats?.totalSuratVerified || 0}
          isLoading={isLoading}
          icon={<DocumentTextIcon className="w-6 h-6 text-warning" />}
          color="warning"
          action={
            !isLoading && (
              <Button
                size="sm"
                color="warning"
                onPress={() => router.push("/warga/surat?filter=verified")}
              >
                Lihat Hasil
              </Button>
            )
          }
        />
      </div>
    </>
  );
}
