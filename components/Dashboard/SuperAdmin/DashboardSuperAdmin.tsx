"use client";

import {
  DocumentTextIcon,
  ShieldExclamationIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { QuickActions } from "./QuickActions";
import { RecentActivities } from "./RecentActivities";
import { StatsCard } from "./StatsCard";
import { SystemOverview } from "./SystemOverview";
import { TableActionsDemo } from "./TableActionsDemo";
import { useRouter } from "next/navigation";
import {
  getBackupStatus,
  getDatabaseStatus,
  getDiskStatus,
  getServerStatus,
} from "@/services/healthService";
import { SkeletonText } from "@/components/ui/skeleton/SkeletonText";

export default function DashboardSuperAdmin() {
  const { data: serverStatusData, isLoading: serverLoading } = useQuery({
    queryKey: ["health-server"],
    queryFn: getServerStatus,
    refetchInterval: 10000,
  });

  const { data: databaseStatusData, isLoading: databaseLoading } = useQuery({
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

  const [stats, setStats] = useState({
    totalUsers: 150,
    totalSurat: 1234,
    pendingReview: 45,
    systemAlerts: 3,
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
    databaseStatusData?.status || "Unknown"
  );
  const backupStatus = backupLoading ? (
    <SkeletonText />
  ) : (
    backupStatusData?.status || "Unknown"
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
          value={stats.totalSurat}
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
          title={"Surat Masuk"}
          value={stats.totalSurat}
          color="success"
          action={
            <Button onPress={() => {}} color="primary" size="sm">
              View Surat
            </Button>
          }
          icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
        />
        <StatsCard
          title={"Surat Keluar"}
          value={stats.totalSurat}
          color="success"
          action={
            <Button color="success" size="sm">
              View Surat
            </Button>
          }
          icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
        />
        <StatsCard
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
          title="Total Users"
          value={stats.totalUsers}
          color="primary"
        />

        <StatsCard
          action={
            <Button color="warning" size="sm">
              Review
            </Button>
          }
          icon={<ShieldExclamationIcon className="w-6 h-6 text-warning" />}
          title="Surat Dalam Tinjauan"
          value={stats.pendingReview}
          color="warning"
        />

        <StatsCard
          action={
            <Button color="danger" size="sm">
              Review
            </Button>
          }
          icon={<ShieldExclamationIcon className="w-6 h-6 text-danger" />}
          title="Surat Ditolak"
          value={stats.pendingReview}
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemOverview
          serverStatus={serverStatus}
          databaseStatus={databaseStatus}
          backupStatus={backupStatus}
          diskStatus={diskStatus}
        />
        <RecentActivities />
      </div>

      {/* <QuickActions /> */}
      <TableActionsDemo />
    </div>
  );
}
