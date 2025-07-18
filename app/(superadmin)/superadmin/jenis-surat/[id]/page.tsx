"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getJenisSuratById } from "@/services/jenisSuratService";

// import { Badge } from "@/components/ui/badge";
import { Chip } from "@heroui/chip";

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
            <div>
              <h3 className="text-sm text-gray-500">Kode Surat</h3>
              <p className="text-base font-medium text-gray-800">{data.kode}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Nama Jenis Surat</h3>
              <p className="text-base font-medium text-gray-800">{data.nama}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Deskripsi</h3>
              <p className="text-base text-gray-700">{data.deskripsi || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Status Aktif</h3>
              <Chip color={data.aktif ? "success" : "danger"}>
                {data.aktif ? "Aktif" : "Tidak Aktif"}
              </Chip>
            </div>
          </div>
        )}
      </CardContainer>
    </>
  );
}
