"use client";

import React, { useState } from "react";
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
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Surat, JenisSurat } from "@prisma/client";

import { PageHeader } from "@/components/common/PageHeader";
import LoadingScreen from "@/components/ui/loading/LoadingScreen";
import {
  downloadSuratPdf,
  getSuratHistory,
  previewSuratPengantar,
  previewSuratPdf,
} from "@/services/suratService";
import SuratProgress from "@/components/SuratPermohonan/SuratProgress";
import { showToast } from "@/utils/toastHelper";

type SuratWithJenis = Surat & { jenis: JenisSurat };

const getStatusColor = (status: string) => {
  switch (status) {
    case "DIAJUKAN":
      return "default";
    case "DIVERIFIKASI_STAFF":
      return "primary";
    case "DITOLAK_STAFF":
      return "danger";
    case "DIVERIFIKASI_RT":
      return "primary";
    case "DITOLAK_RT":
      return "danger";
    case "DIVERIFIKASI_LURAH":
      return "success";
    case "DITOLAK_LURAH":
      return "danger";
    case "DITERBITKAN":
      return "success";
    default:
      return "default";
  }
};

export default function HistorySuratPermohonanPage() {
  const { data: history = [], isLoading } = useQuery<SuratWithJenis[]>({
    queryKey: ["riwayat-surat"],
    queryFn: getSuratHistory,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Loading states untuk berbagai actions
  const [loadingStates, setLoadingStates] = useState({
    downloadPdf: null, // akan berisi ID surat yang sedang download
    previewPdf: null, // akan berisi ID surat yang sedang preview
    previewPengantar: null, // akan berisi ID surat pengantar yang sedang preview
  });

  // Helper function untuk set loading state
  const setActionLoading = (type, suratId = null) => {
    setLoadingStates((prev) => ({
      ...prev,
      [type]: suratId,
    }));
  };

  // Check if any loading is active
  const isAnyLoading = Object.values(loadingStates).some(
    (state) => state !== null,
  );

  // Function to handle download PDF with loading
  const handleDownloadPdf = async (suratId) => {
    try {
      setActionLoading("downloadPdf", suratId);
      await downloadSuratPdf(suratId);
      showToast({
        title: "Berhasil",
        description: "Surat berhasil diunduh",
        color: "success",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showToast({
        title: "Gagal",
        description: error.message || "Gagal mengunduh surat",
        color: "error",
      });
    } finally {
      setActionLoading("downloadPdf", null);
    }
  };

  // Function to handle preview PDF with loading
  const handlePreviewPdf = async (suratId) => {
    try {
      setActionLoading("previewPdf", suratId);
      await previewSuratPdf(suratId);
    } catch (error) {
      console.error("Error previewing PDF:", error);
      showToast({
        title: "Gagal",
        description: error.message || "Gagal memuat preview surat",
        color: "error",
      });
    } finally {
      setActionLoading("previewPdf", null);
    }
  };

  // Function to handle preview surat pengantar with loading
  const handlePreviewPengantar = async (suratId) => {
    try {
      setActionLoading("previewPengantar", suratId);
      await previewSuratPengantar(suratId);
    } catch (error) {
      console.error("Error previewing surat pengantar:", error);
      showToast({
        title: "Gagal",
        description: error.message || "Gagal memuat surat pengantar",
        color: "error",
      });
    } finally {
      setActionLoading("previewPengantar", null);
    }
  };

  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(history.length / itemsPerPage);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Determine loading message based on active loading state
  const getLoadingMessage = () => {
    if (loadingStates.downloadPdf) return "Mengunduh surat PDF...";
    if (loadingStates.previewPdf) return "Memuat preview surat...";
    if (loadingStates.previewPengantar) return "Memuat surat pengantar...";

    return "Memuat...";
  };

  return (
    <>
      {/* Loading Screen Overlay dengan dynamic message */}
      {isAnyLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-40 h-40">
              <LoadingScreen />
            </div>
            <p className="text-white text-sm font-medium">
              {getLoadingMessage()}
            </p>
          </div>
        </div>
      )}

      <PageHeader
        title="Riwayat Permohonan"
        description="Berikut adalah riwayat permohonan surat Anda."
        breadcrumbs={[
          { label: "Dashboard", href: "/warga/dashboard" },
          { label: "Permohonan Surat", href: "/warga/dashboard" },
          { label: "Riwayat Permohonan" },
        ]}
      />

      <div className="space-y-4">
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
              <p className="text-default-500">Belum ada permohonan surat.</p>
            </CardBody>
          </Card>
        ) : (
          <>
            {paginatedHistory.map((surat) => (
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

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <Button
                      as={Link}
                      href={`/warga/permohonan/history/${surat.id}`}
                      variant="flat"
                      color="primary"
                      size="sm"
                      startContent={<EyeIcon className="h-4 w-4" />}
                      isDisabled={isAnyLoading}
                    >
                      Lihat Detail
                    </Button>

                    {/* Preview PDF Button - Available for verified surat */}
                    {[
                      "DIVERIFIKASI_STAFF",
                      "DIVERIFIKASI_RT",
                      "DIVERIFIKASI_LURAH",
                      "DITERBITKAN",
                    ].includes(surat.status) && (
                      <Button
                        variant="flat"
                        color="secondary"
                        size="sm"
                        startContent={<EyeIcon className="h-4 w-4" />}
                        isLoading={loadingStates.previewPdf === surat.id}
                        isDisabled={isAnyLoading}
                        onPress={() => handlePreviewPdf(surat.id)}
                      >
                        {loadingStates.previewPdf === surat.id
                          ? "Loading..."
                          : "Preview Surat"}
                      </Button>
                    )}

                    {/* Download PDF Button - Only for DIVERIFIKASI_LURAH */}
                    {surat.status === "DIVERIFIKASI_LURAH" && (
                      <Button
                        variant="flat"
                        color="success"
                        size="sm"
                        startContent={
                          <DocumentArrowDownIcon className="h-4 w-4" />
                        }
                        isLoading={loadingStates.downloadPdf === surat.id}
                        isDisabled={isAnyLoading}
                        onPress={() => handleDownloadPdf(surat.id)}
                      >
                        {loadingStates.downloadPdf === surat.id
                          ? "Downloading..."
                          : "Unduh PDF"}
                      </Button>
                    )}

                    {/* Preview Surat Pengantar Button - Available when RT verified */}
                    {surat.idRT && (
                      <Button
                        variant="flat"
                        color="warning"
                        size="sm"
                        startContent={<DocumentTextIcon className="h-4 w-4" />}
                        isLoading={loadingStates.previewPengantar === surat.id}
                        isDisabled={isAnyLoading}
                        onPress={() => handlePreviewPengantar(surat.id)}
                      >
                        {loadingStates.previewPengantar === surat.id
                          ? "Loading..."
                          : "Lihat Surat Pengantar"}
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <Button
                  size="sm"
                  variant="light"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || isAnyLoading}
                  startContent={<ChevronLeftIcon className="w-4 h-4" />}
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-default-600 self-center">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="light"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || isAnyLoading}
                  endContent={<ChevronRightIcon className="w-4 h-4" />}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
