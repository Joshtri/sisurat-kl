"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DocumentIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { previewSuratPdf, previewSuratPengantar } from "@/services/suratService";
import { showToast } from "@/utils/toastHelper";
import LoadingScreen from "@/components/ui/loading/LoadingScreen";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterType: "jenis" | "status" | null;
  filterValue: string;
  period: string;
  startDate?: string;
  endDate?: string;
}

interface SuratDetail {
  id: string;
  noSurat: string;
  jenis: string;
  pemohon: string;
  status: string;
  tanggal: string;
}

const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
  DITERBITKAN: "success",
  DIAJUKAN: "warning",
  DIVERIFIKASI_STAFF: "warning",
  DIVERIFIKASI_RT: "warning",
  DIVERIFIKASI_LURAH: "warning",
  DITOLAK_STAFF: "danger",
  DITOLAK_RT: "danger",
  DITOLAK_LURAH: "danger",
};

const statusLabels: Record<string, string> = {
  DIAJUKAN: "Diajukan",
  DIVERIFIKASI_STAFF: "Verifikasi Staff",
  DITOLAK_STAFF: "Ditolak Staff",
  DIVERIFIKASI_RT: "Verifikasi RT",
  DITOLAK_RT: "Ditolak RT",
  DIVERIFIKASI_LURAH: "Verifikasi Lurah",
  DITOLAK_LURAH: "Ditolak Lurah",
  DITERBITKAN: "Diterbitkan",
};

export function DetailModal({
  isOpen,
  onClose,
  filterType,
  filterValue,
  period,
  startDate,
  endDate,
}: DetailModalProps) {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["surat-detail", filterType, filterValue, period, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        period,
        filterType: filterType || "",
        filterValue,
      });

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get(`/api/superadmin/laporan/detail?${params}`);
      return response.data.data as SuratDetail[];
    },
    enabled: isOpen && !!filterType && !!filterValue,
  });

  const getTitle = () => {
    if (filterType === "jenis") {
      return `Detail: ${filterValue}`;
    }
    if (filterType === "status") {
      return `Detail: ${statusLabels[filterValue] || filterValue}`;
    }
    return "Detail";
  };

  return (
    <>
      {isLoadingPreview && <LoadingScreen />}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {getTitle()}
          <p className="text-sm font-normal text-default-500">
            Daftar surat yang sesuai dengan filter
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : data && data.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-default-600 mb-4">
                Total: <span className="font-semibold">{data.length}</span> surat
              </div>
              {data.map((surat, index) => (
                <div
                  key={surat.id}
                  className="p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-default-400">#{index + 1}</span>
                        <span className="font-semibold text-sm">
                          {surat.noSurat || "Belum ada nomor"}
                        </span>
                      </div>
                      <p className="text-sm text-default-600">{surat.jenis}</p>
                    </div>
                    <Chip
                      color={statusColorMap[surat.status] || "default"}
                      variant="flat"
                      size="sm"
                    >
                      {statusLabels[surat.status] || surat.status}
                    </Chip>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-default-500 mt-3">
                    <div>
                      <span className="font-medium">Pemohon:</span>{" "}
                      {surat.pemohon}
                    </div>
                    <div>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {new Date(surat.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-default-200">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<DocumentIcon className="w-4 h-4" />}
                      onPress={async () => {
                        setIsLoadingPreview(true);
                        try {
                          await previewSuratPdf(surat.id);
                        } catch (err: any) {
                          showToast({
                            title: "Gagal Preview",
                            description: err.message,
                            color: "error",
                          });
                        } finally {
                          setIsLoadingPreview(false);
                        }
                      }}
                    >
                      Preview PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="secondary"
                      startContent={<DocumentTextIcon className="w-4 h-4" />}
                      onPress={async () => {
                        setIsLoadingPreview(true);
                        try {
                          await previewSuratPengantar(surat.id);
                        } catch (err: any) {
                          showToast({
                            title: "Gagal Preview",
                            description: err.message,
                            color: "error",
                          });
                        } finally {
                          setIsLoadingPreview(false);
                        }
                      }}
                    >
                      Preview Pengantar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-default-400">
              <p>Tidak ada data yang ditemukan</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}
