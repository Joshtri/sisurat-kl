"use client";

import {
  DocumentTextIcon,
  UserGroupIcon,
  HomeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";

import NotificationGrid from "../Notification/NotificationGrid";

import { StatsCard } from "@/components/ui/StatsCard";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getRTDashboardStats } from "@/services/dashboardService";
import { getMe } from "@/services/authService";

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
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard RT</h1>
          {user && (
            <p className="text-default-600">
              Selamat datang,{" "}
              <span className="font-semibold">{user.username}</span> 👋
            </p>
          )}
        </div>

        {/* Info Wilayah */}
        {stats?.wilayah && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
            <CardBody className="flex flex-row items-center gap-4">
              <HomeIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Wilayah Tanggung Jawab
                </h2>
                <div className="flex items-center gap-4 mt-1">
                  <Chip color="primary" variant="flat">
                    RT {stats.wilayah.rt}
                  </Chip>
                  {stats.wilayah.rw && (
                    <Chip color="secondary" variant="flat">
                      RW {stats.wilayah.rw}
                    </Chip>
                  )}
                  {stats.wilayah.namaRT && (
                    <span className="text-sm text-gray-600">
                      Ketua: {stats.wilayah.namaRT}
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {isLoading ? (
          <SkeletonCard rows={4} />
        ) : (
          <>
            {/* Statistik Demografis */}
            <StatsCard
              title="Total Warga"
              value={stats?.statistik?.totalWarga || 0}
              icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />}
              color="primary"
              description="Jumlah seluruh warga di RT ini"
              action={
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => router.push("/rt/warga")}
                >
                  Lihat Warga
                </Button>
              }
            />

            <StatsCard
              title="Total Kartu Keluarga"
              value={stats?.statistik?.totalKK || 0}
              icon={<HomeIcon className="w-6 h-6 text-green-600" />}
              color="success"
              description={`Rata-rata ${stats?.statistik?.avgWargaPerKK || 0} warga/KK`}
              action={
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  onPress={() => router.push("/rt/daftar-kartu-keluarga")}
                >
                  Lihat KK
                </Button>
              }
            />

            {/* Statistik Surat */}
            <StatsCard
              title="Surat Menunggu"
              value={stats?.statistik?.totalSuratMasuk || 0}
              icon={<ClockIcon className="w-6 h-6 text-orange-600" />}
              color="warning"
              description="Perlu verifikasi RT"
              action={
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  onPress={() => router.push("/rt/pengajuan")}
                >
                  Verifikasi
                </Button>
              }
            />

            <StatsCard
              title="Total Surat Diproses"
              value={stats?.statistik?.totalSuratProses || 0}
              icon={<ChartBarIcon className="w-6 h-6 text-purple-600" />}
              color="secondary"
              description="Semua surat yang masuk"
              action={
                <Button
                  size="sm"
                  color="secondary"
                  variant="flat"
                  onPress={() => router.push("/rt/pengajuan")}
                >
                  Lihat Semua
                </Button>
              }
            />
          </>
        )}
      </div>

      {/* Breakdown Surat Cards */}
      {!isLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="border-l-4 border-l-green-500">
            <CardBody className="flex flex-row items-center gap-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Surat Diverifikasi
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {stats.statistik.totalSuratVerified}
                </p>
                <p className="text-sm text-gray-500">
                  Surat yang sudah disetujui
                </p>
              </div>
              <Button
                size="sm"
                color="success"
                variant="ghost"
                onPress={() => router.push("/rt/pengajuan")}
              >
                Lihat
              </Button>
            </CardBody>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardBody className="flex flex-row items-center gap-4">
              <XCircleIcon className="w-8 h-8 text-red-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Surat Ditolak
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {stats.statistik.totalSuratDitolak}
                </p>
                <p className="text-sm text-gray-500">
                  Surat yang tidak disetujui
                </p>
              </div>
              <Button
                size="sm"
                color="danger"
                variant="ghost"
                onPress={() => router.push("/rt/pengajuan")}
              >
                Lihat
              </Button>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Notifications */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Notifikasi & Aktivitas</h2>
        <NotificationGrid getMeData={user} />
      </div>
    </>
  );
}
