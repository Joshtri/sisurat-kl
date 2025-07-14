"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { UserIcon } from "@heroicons/react/24/outline";

import { getWargaByRT } from "@/services/wargaService";
import { getMe } from "@/services/authService";
import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { formatDateIndo } from "@/utils/common";

export default function WargaRTPage() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["warga-rt"],
    queryFn: getWargaByRT,
    enabled: !!user?.id,
  });

  const columns = [
    { key: "nik", label: "NIK" },
    { key: "namaLengkap", label: "Nama Lengkap" },
    { key: "jenisKelamin", label: "Jenis Kelamin" },
    { key: "tanggalLahir", label: "Tanggal Lahir" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "alamatKK", label: "Alamat KK" },
    { key: "rtrw", label: "RT/RW" },
    { key: "noKK", label: "No. KK" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const formatJK = (val: string) =>
    val === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";

  const rows = data.map((item) => ({
    key: item.id,
    nik: item.nik,
    namaLengkap: item.namaLengkap,
    jenisKelamin: formatJK(item.jenisKelamin),
    tanggalLahir: formatDateIndo(item.tanggalLahir || ""),
    pekerjaan: item.pekerjaan || "-",
    alamatKK: item.kartuKeluarga?.alamat || "-",
    rtrw: `RT ${item.kartuKeluarga?.rt || "-"} / RW ${item.kartuKeluarga?.rw || "-"}`,
    noKK: item.kartuKeluarga?.nomorKK || "-",
    // actions: (
    //   <TableActions onView={() => router.push(`/rt/warga/${item.id}`)} />
    // ),
  }));

  return (
    <ListGrid
      title="Data Warga"
      description="Daftar seluruh warga yang tinggal di RT Anda."
      breadcrumbs={[
        { label: "Dashboard", href: "/rt/dashboard" },
        { label: "Data Warga" },
      ]}
      columns={columns}
      rows={rows}
      loading={isLoading}
      pageSize={10}
      showPagination
      searchPlaceholder="Cari warga..."
      empty={
        <EmptyState
          title="Belum ada data warga"
          description="Belum ada data warga yang terdaftar di wilayah Anda."
          icon={<UserIcon className="w-6 h-6" />}
        />
      }
      onSearch={(query) => {
        console.log("Search query:", query);
      }}
    />
  );
}
