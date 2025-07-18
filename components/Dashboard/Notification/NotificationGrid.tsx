"use client";

import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import Link from "next/link";

import { showToast } from "@/utils/toastHelper";
import { formatDateIndo } from "@/utils/common";
import { getSuratByRT, getNotificationByRole } from "@/services/suratService";

interface NotificationGridProps {
  getMeData?: any; // Optional prop to pass user data
}

export default function NotificationGrid({ getMeData }: NotificationGridProps) {
  const user = getMeData;
  const enabled = !!user?.role;

  const {
    data: suratList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifikasi-surat", user?.role],
    queryFn: async () => {
      if (user?.role === "RT") return getSuratByRT();

      return getNotificationByRole(user?.role);
    },
    enabled,
  });

  if (isError) {
    showToast({
      title: "Gagal memuat notifikasi",
      description: "Terjadi kesalahan saat mengambil data surat.",
      color: "error",
    });
  }

  const filteredSurat = suratList.filter((surat: any) => {
    switch (user?.role) {
      case "RT":
        return surat.status === "DIAJUKAN";
      case "STAFF":
        return surat.status === "DIVERIFIKASI_RT";
      case "LURAH":
        return surat.status === "DIVERIFIKASI_STAFF";
      case "WARGA":
        return surat.status !== "DIAJUKAN";
      default:
        return false;
    }
  });

  const getDetailUrl = (id: string) => {
    switch (user?.role) {
      case "RT":
        return `/rt/pengajuan/${id}`;
      case "STAFF":
        return `/staff/pengajuan/${id}`;
      case "LURAH":
        return `/lurah/surat/${id}`;
      case "WARGA":
        return `/warga/riwayat/${id}`;
      default:
        return "#";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-lg font-semibold">
          <BellIcon className="w-5 h-5 text-primary" />
          Notifikasi Surat
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Memuat notifikasi...</p>
        ) : filteredSurat.length === 0 ? (
          <p className="text-sm text-gray-500">Tidak ada notifikasi baru.</p>
        ) : (
          filteredSurat.map((surat: any) => (
            <div key={surat.id} className="border rounded-lg p-3 shadow-sm">
              <div className="font-medium text-sm mb-1">
                {surat.jenis?.nama || "Surat"}
              </div>
              <div className="text-sm text-gray-600">
                Pengaju: {surat.pemohon?.profil?.namaLengkap || "-"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Status: {surat.status.replace(/_/g, " ")} |{" "}
                {formatDateIndo(surat.createdAt)}
              </div>

              <Link href={getDetailUrl(surat.id)}>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  className="mt-2"
                >
                  Lihat Detail
                </Button>
              </Link>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}
