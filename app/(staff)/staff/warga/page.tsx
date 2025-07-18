"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getAllWarga } from "@/services/wargaService";
import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { formatDateIndo } from "@/utils/common";

export default function WargaPage() {
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
    alamat: item.alamat || "-",
    rtrw: `${item.rt || "-"} / ${item.rw || "-"}`,
    status: formatStatus(item.statusHidup),
    actions: (
      <TableActions
        // onDelete={{
        //   onConfirm: () =>
        //     alert(`Hapus warga ${item.namaLengkap} (NIK: ${item.nik})`),
        // }}
        // onEdit={() => router.push(`/superadmin/warga/${item.id}/edit`)}
        // onEdit={() => alert(`Edit warga ${item.namaLengkap}`)}
        onView={() => router.push(`/staff/warga/${item.id}`)}
      />
    ),
  }));

  return (
    <ListGrid
      //   actions={
      //     <Button
      //       color="primary"
      //       onPress={() => router.push("/staff/warga/create")}
      //     >
      //       Tambah Warga
      //     </Button>
      //   }
      breadcrumbs={[
        { label: "Dashboard", href: "/staff/dashboard" },
        { label: "Warga" },
      ]}
      columns={columns}
      description="Daftar warga yang terdaftar di sistem"
      empty={<EmptyState title="Belum ada data warga" />}
      loading={isLoading}
      pageSize={10}
      rows={rows}
      searchPlaceholder="Cari warga..."
      showPagination={true}
      title="Data Warga"
      onSearch={(query) => console.log("Search:", query)}
    />
  );
}
