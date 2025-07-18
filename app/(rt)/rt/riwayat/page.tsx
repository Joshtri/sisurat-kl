"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@heroui/react";
import { Button } from "@heroui/button";

import { PageHeader } from "@/components/common/PageHeader";
import { ListGrid } from "@/components/ui/ListGrid";
import { getSuratByRT } from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";

export default function RiwayatPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterTrigger, setFilterTrigger] = useState(0);

  const { data = [], isLoading } = useQuery({
    queryKey: ["riwayat-surat", startDate, endDate, filterTrigger],
    queryFn: () =>
      getSuratByRT(startDate && endDate ? { startDate, endDate } : undefined),
  });

  const columns = [
    { key: "nama", label: "Nama Pemohon" },
    { key: "nik", label: "NIK" },
    { key: "jenis", label: "Jenis Surat" },
    { key: "tanggal", label: "Tanggal Pengajuan" },
    { key: "status", label: "Status" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((item) => ({
    key: item.id,
    nama: item.pemohon?.profil?.namaLengkap || item.pemohon?.username,
    nik: item.pemohon?.profil?.nik || "-",
    jenis: item.jenis?.nama || "-",
    tanggal: formatDateIndo(item.tanggalPengajuan),
    status: item.status.replace(/_/g, " "),
  }));

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/rt/dashboard" },
          { label: "Riwayat Surat" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 gap-2 mb-4">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          {/* <label className="text-sm font-medium">Dari Tanggal</label> */}
          <Input
            label="Dari Tanggal"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          {/* <label className="text-sm font-medium">Sampai Tanggal</label> */}
          <Input
            label="Sampai Tanggal"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="pt-1">
          <Button
            size="sm"
            color="primary"
            onPress={() => setFilterTrigger((prev) => prev + 1)}
            isDisabled={!startDate || !endDate}
          >
            Tampilkan
          </Button>
        </div>
      </div>

      <ListGrid
        title="Riwayat Surat"
        rows={rows}
        columns={columns}
        loading={isLoading}
      />
    </>
  );
}
