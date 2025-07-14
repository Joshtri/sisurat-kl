"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { getSuratHistory } from "@/services/suratService";
import { Surat, JenisSurat } from "@prisma/client";
import SuratProgress from "@/components/SuratPermohonan/SuratProgress";

type SuratWithJenis = Surat & { jenis: JenisSurat };

export default function HistorySuratPermohonanPage() {
  const { data: history = [], isLoading } = useQuery<SuratWithJenis[]>({
    queryKey: ["riwayat-surat"],
    queryFn: getSuratHistory,
  });

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
          <p>Memuat riwayat surat...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">
            Belum ada permohonan surat yang diajukan.
          </p>
        ) : (
          history.map((surat) => (
            <div
              key={surat.id}
              className="border rounded-md p-4 shadow-sm bg-white"
            >
              <h3 className="font-semibold text-lg">{surat.jenis.nama}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="font-medium">{surat.status}</span>
              </p>

              <SuratProgress status={surat.status} />

              <p className="text-sm text-gray-500">
                Diajukan pada:{" "}
                {new Date(surat.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {surat.noSurat && (
                <p className="text-sm text-gray-500">
                  No Surat: {surat.noSurat}
                </p>
              )}

              <a
                href={`/warga/permohonan/history/${surat.id}`}
                className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium"
              >
                Lihat Detail →
              </a>
            </div>
          ))
        )}
      </div>
    </>
  );
}
