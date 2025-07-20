"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Chip } from "@heroui/chip";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { getJenisSuratById } from "@/services/jenisSuratService";

export default function DetailJenisSuratPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["jenis-surat", id],
    queryFn: () => getJenisSuratById(id as string),
    enabled: !!id,
  });

  return (
    <>
      <PageHeader
        title="Detail Jenis Surat"
        backHref="/superadmin/jenis-surat"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Jenis Surat", href: "/superadmin/jenis-surat" },
          { label: "Detail" },
        ]}
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={5} />}>
        {data && (
          <div className="space-y-4">
            <ReadOnlyInput label="Kode Surat" value={data.kode} />
            <ReadOnlyInput label="Nama Jenis Surat" value={data.nama} />
            <ReadOnlyInput label="Deskripsi" value={data.deskripsi} />
            <div>
              <label className="text-sm font-medium text-gray-600">
                Status Aktif
              </label>
              <div className="mt-1">
                <Chip color={data.aktif ? "success" : "danger"}>
                  {data.aktif ? "Aktif" : "Tidak Aktif"}
                </Chip>
              </div>
            </div>
          </div>
        )}
      </CardContainer>
    </>
  );
}
