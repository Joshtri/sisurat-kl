"use client";

import {
  DocumentTextIcon,
  UserGroupIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { StatsCard } from "@/components/ui/StatsCard";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getRTDashboardStats } from "@/services/rtService";

export default function DashboardRTPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["rt-dashboard-stats"],
    queryFn: getRTDashboardStats,
  });

  return (
    <>
      <PageHeader
        title="Dashboard RT"
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={[
          <Button
            key="buat-surat"
            onPress={() => router.push("/rt/surat/create")}
            color="primary"
            startContent={<PlusIcon className="w-5 h-5" />}
          >
            Buat Surat
          </Button>,
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {isLoading ? (
          <SkeletonCard rows={3} />
        ) : (
          <>
            <StatsCard
              title="Total Warga RT"
              value={data?.totalWarga || 0}
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
              value={data?.totalSuratMasuk || 0}
              icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
              color="success"
              action={
                <Button
                  size="sm"
                  color="success"
                  onPress={() => router.push("/rt/surat")}
                >
                  Lihat Surat
                </Button>
              }
            />

            <StatsCard
              title="Surat Diverifikasi"
              value={data?.totalSuratVerified || 0}
              icon={<DocumentTextIcon className="w-6 h-6 text-warning" />}
              color="warning"
              action={
                <Button
                  size="sm"
                  color="warning"
                  onPress={() => router.push("/rt/surat?filter=verified")}
                >
                  Lihat Hasil
                </Button>
              }
            />
          </>
        )}
      </div>
    </>
  );
}
