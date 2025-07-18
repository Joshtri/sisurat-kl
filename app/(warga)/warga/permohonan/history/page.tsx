"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Spinner,
  Link,
  Divider,
} from "@heroui/react";
import {
  DocumentTextIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Surat, JenisSurat } from "@prisma/client";

import { PageHeader } from "@/components/common/PageHeader";
import { downloadSuratPdf, getSuratHistory } from "@/services/suratService";
import SuratProgress from "@/components/SuratPermohonan/SuratProgress";

type SuratWithJenis = Surat & { jenis: JenisSurat };

const getStatusColor = (status: string) => {
  switch (status) {
    case "DIVERIFIKASI_LURAH":
      return "success";
    case "DIVERIFIKASI_KADES":
      return "primary";
    case "MENUNGGU_VERIFIKASI":
      return "warning";
    case "DITOLAK":
      return "danger";
    default:
      return "default";
  }
};

export default function HistorySuratPermohonanPage() {
  const { data: history = [], isLoading } = useQuery<SuratWithJenis[]>({
    queryKey: ["riwayat-surat"],
    queryFn: getSuratHistory,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <PageHeader
        title="Riwayat Permohonan"
        description="Berikut adalah riwayat permohonan surat Anda."
        breadcrumbs={[
          { label: "Dashboard", href: "/warga/dashboard" },
          { label: "Permohonan Surat", href: "/warga/dashboard" },
          { label: "Riwayat Permohonan" },
        ]}
      />

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <Card>
            <CardBody className="flex items-center justify-center py-8">
              <Spinner size="lg" />
              <p className="mt-4 text-default-500">Memuat riwayat surat...</p>
            </CardBody>
          </Card>
        ) : history.length === 0 ? (
          <Card>
            <CardBody className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-default-300 mb-4" />
              <p className="text-default-500">
                Belum ada permohonan surat yang diajukan.
              </p>
            </CardBody>
          </Card>
        ) : (
          history.map((surat) => (
            <Card key={surat.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {surat.jenis.nama}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="h-4 w-4 text-default-400" />
                        <span className="text-sm text-default-500">
                          {formatDate(surat.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Chip
                    color={getStatusColor(surat.status)}
                    variant="flat"
                    size="sm"
                  >
                    {surat.status}
                  </Chip>
                </div>
              </CardHeader>

              <Divider />

              <CardBody className="pt-4">
                <SuratProgress status={surat.status} />

                {surat.noSurat && (
                  <div className="mt-4 p-3 bg-default-50 rounded-lg">
                    <p className="text-sm text-default-600">
                      <span className="font-medium">No Surat:</span>{" "}
                      {surat.noSurat}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    as={Link}
                    href={`/warga/permohonan/history/${surat.id}`}
                    variant="flat"
                    color="primary"
                    size="sm"
                    startContent={<EyeIcon className="h-4 w-4" />}
                  >
                    Lihat Detail
                  </Button>

                  {surat.status === "DIVERIFIKASI_LURAH" && (
                    <Button
                      onClick={() => downloadSuratPdf(surat.id)}
                      variant="flat"
                      color="success"
                      size="sm"
                      startContent={
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      }
                    >
                      Unduh PDF
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
