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
import { useState, useEffect } from "react";

import { StatsCard } from "@/components/ui/StatsCard";
import { getMe } from "@/services/authService";
import { getWargaDashboardStats } from "@/services/dashboardService";
import { checkUserCompletion } from "@/services/userCompletionService";
import OnboardingWargaModal from "@/components/Dashboard/Warga/OnboardingWargaModal";

export default function DashboardWarga() {
  const router = useRouter();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["warga-dashboard-stats", user?.id],
    queryFn: () => getWargaDashboardStats(user?.id ?? ""),
    enabled: !!user?.id,
  });

  // Query untuk mengecek kelengkapan data
  const { data: completionData, isLoading: isCheckingCompletion } = useQuery({
    queryKey: ["user-completion"],
    queryFn: checkUserCompletion,
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });

  // Effect untuk menampilkan modal onboarding jika data tidak lengkap
  useEffect(() => {
    if (completionData && !completionData.isComplete && !isCheckingCompletion) {
      setShowOnboardingModal(true);
    }
  }, [completionData, isCheckingCompletion]);

  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);
  };

  const handleAjukanSurat = () => {
    // Cek kelengkapan data sebelum redirect
    if (completionData && !completionData.isComplete) {
      setShowOnboardingModal(true);
      return;
    }
    router.push("/warga/permohonan/create");
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Warga</h1>
          {user && (
            <p className="text-default-600">
              Selamat datang,{" "}
              <span className="font-semibold">{user.username}</span> 👋
            </p>
          )}

          {/* Card Alert - Update sesuai status kelengkapan data */}
          <div
            className={`mt-4 border-l-4 p-4 rounded-md shadow-sm ${
              completionData?.isComplete
                ? "bg-green-50 border-green-400"
                : "bg-yellow-50 border-yellow-400"
            }`}
          >
            <div className="flex items-start space-x-3">
              <DocumentTextIcon
                className={`w-6 h-6 ${
                  completionData?.isComplete
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              />
              <div>
                <h3
                  className={`text-sm font-medium ${
                    completionData?.isComplete
                      ? "text-green-800"
                      : "text-yellow-800"
                  }`}
                >
                  {completionData?.isComplete ? "Data Lengkap" : "Perhatian"}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    completionData?.isComplete
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {completionData?.isComplete
                    ? "Data profil Anda sudah lengkap. Anda dapat mengajukan surat dengan mudah."
                    : "Pastikan data profil Anda sudah lengkap sebelum mengajukan surat. Surat yang diajukan tanpa data lengkap bisa ditolak oleh sistem."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              color="primary"
              startContent={<PlusIcon className="w-5 h-5" />}
              onPress={handleAjukanSurat}
              isDisabled={isCheckingCompletion}
            >
              {isCheckingCompletion ? "Memuat..." : "Ajukan Surat Baru"}
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

      {/* Modal Onboarding */}
      {completionData && (
        <OnboardingWargaModal
          isOpen={showOnboardingModal}
          userData={{
            email: completionData.user.email,
            numberWhatsApp: completionData.user.numberWhatsApp,
          }}
          profilData={completionData.profil}
          onComplete={handleOnboardingComplete}
        />
      )}
    </>
  );
}
