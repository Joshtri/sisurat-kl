"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserIcon } from "@heroicons/react/24/outline";

import { getAllWarga } from "@/services/wargaService";
import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDateIndo } from "@/utils/common";
import { Button } from "@heroui/button";

export default function DaftarWargaPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery({
    queryKey: ["warga"],
    queryFn: getAllWarga,
  });

  const columns = [
    { key: "nik", label: "NIK" },
    { key: "namaLengkap", label: "Nama Lengkap" },
    { key: "jenisKelamin", label: "Jenis Kelamin" },
    { key: "tempatTanggalLahir", label: "Tanggal Lahir" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "alamat", label: "Alamat" },
    { key: "rtrw", label: "RT/RW" },
    { key: "status", label: "Status" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const formatJenisKelamin = (jk: string) => {
    return jk === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";
  };

  const formatStatus = (status: string) => {
    return status === "HIDUP" ? "Hidup" : "Meninggal";
  };

  const rows = data.map((item) => ({
    key: item.id,
    nik: item.nik,
    namaLengkap: item.namaLengkap,
    jenisKelamin: formatJenisKelamin(item.jenisKelamin),
    tempatTanggalLahir:
      formatDateIndo(item.tanggalLahir ? String(item.tanggalLahir) : "") || "-",
    pekerjaan: item.pekerjaan || "-",
    alamat: item.kartuKeluarga?.alamat || "-",
    rtrw: `${item.kartuKeluarga?.rt || "-"} / ${item.kartuKeluarga?.rw || "-"}`,
    status: formatStatus(item.statusHidup),
    actions: (
      <Button
        color="primary"
        onPress={() => router.push(`/lurah/daftar-warga/${item.id}`)}
      >
        Lihat Detail
      </Button>
    ),
  }));

  return (
    <ListGrid
      breadcrumbs={[
        { label: "Dashboard", href: "/staff/dashboard" },
        { label: "Daftar Warga" },
      ]}
      columns={columns}
      description="Daftar warga yang terdaftar di kelurahan"
      empty={
        <EmptyState
          description="Belum ada data warga yang terdaftar."
          icon={<UserIcon className="w-6 h-6" />}
          title="Belum ada data warga"
        />
      }
      loading={isLoading}
      pageSize={10}
      rows={rows}
      searchPlaceholder="Cari warga..."
      showPagination={true}
      title="Daftar Warga"
      onSearch={(query) => console.log("Search:", query)}
    />
  );
}
