"use client";

import {
  DocumentTextIcon,
  ShieldExclamationIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { RecentActivities } from "./RecentActivities";
import { StatsCard } from "./StatsCard";
import { SystemOverview } from "./SystemOverview";
import { TableActionsDemo } from "./TableActionsDemo";

import {
  DatabaseStatus,
  getBackupStatus,
  getDatabaseStatus,
  getDiskStatus,
  getServerStatus,
} from "@/services/healthService";
import { SkeletonText } from "@/components/ui/skeleton/SkeletonText";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStatsChart } from "./DashboardStatsChart";

export default function DashboardSuperAdmin() {
  const { data: serverStatusData, isLoading: serverLoading } = useQuery({
    queryKey: ["health-server"],
    queryFn: getServerStatus,
    refetchInterval: 10000,
  });

  const { data: databaseStatusData, isLoading: databaseLoading } =
    useQuery<DatabaseStatus>({
      queryKey: ["health-database"],
      queryFn: getDatabaseStatus,
      refetchInterval: 10000,
    });

  const { data: backupStatusData, isLoading: backupLoading } = useQuery({
    queryKey: ["health-backup"],
    queryFn: getBackupStatus,
    refetchInterval: 30000,
  });

  const { data: diskStatusData, isLoading: diskLoading } = useQuery({
    queryKey: ["disk-usage"],
    queryFn: getDiskStatus,
    refetchInterval: 30000,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const router = useRouter();

  // Extract the status values from the query data
  const serverStatus = serverLoading ? (
    <SkeletonText />
  ) : (
    serverStatusData?.status || "Unknown"
  );
  const databaseStatus = databaseLoading ? (
    <SkeletonText />
  ) : (
    databaseStatusData?.database || "Unknown"
  );
  const backupStatus = backupLoading ? (
    <SkeletonText />
  ) : (
    backupStatusData?.lastBackup || "Unknown"
  );
  const diskStatus = diskLoading ? (
    <SkeletonText />
  ) : (
    diskStatusData?.diskUsage || "Unknown"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Super Admin</h1>
        <p className="text-default-600">
          Selamat datang di portal Super Admin Kelurahan Liliba
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pengajuan Surat"
          value={statsLoading ? <SkeletonText /> : (stats?.totalSurat ?? 0)}
          color="success"
          action={
            <Button
              onPress={() => router.push("/superadmin/surat")}
              color="secondary"
              size="sm"
            >
              View Surat
            </Button>
          }
          icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
        />

        <StatsCard
          title="Total Users"
          value={statsLoading ? <SkeletonText /> : (stats?.totalUsers ?? 0)}
          color="primary"
          action={
            <Button
              onPress={() => router.push("/superadmin/users")}
              color="primary"
              size="sm"
            >
              Lihat Pengguna
            </Button>
          }
          icon={<UserGroupIcon className="w-6 h-6 text-primary" />}
        />

        <StatsCard
          title="Surat Dalam Tinjauan"
          value={statsLoading ? <SkeletonText /> : (stats?.pendingReview ?? 0)}
          color="warning"
          action={
            <Button color="warning" size="sm">
              Review
            </Button>
          }
          icon={<ShieldExclamationIcon className="w-6 h-6 text-warning" />}
        />

        <StatsCard
          title="Surat Ditolak"
          value={statsLoading ? <SkeletonText /> : (stats?.rejected ?? 0)}
          color="danger"
          action={
            <Button color="danger" size="sm">
              Review
            </Button>
          }
          icon={<ShieldExclamationIcon className="w-6 h-6 text-danger" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemOverview
          serverStatus={serverStatus}
          databaseStatus={databaseStatus}
          backupStatus={backupStatus}
          diskStatus={diskStatus}
        />
        <RecentActivities data={stats?.recentActivities ?? []} />
      </div>

      {/* <QuickActions /> */}
      <TableActionsDemo data={stats?.recentActions ?? []} />

      {stats && (
        <DashboardStatsChart
          submittedToday={stats.submittedToday ?? 0}
          published={stats.published ?? 0}
          usersPerRole={stats.usersPerRole ?? {}}
        />
      )}
    </div>
  );
}
