"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
} from "@heroui/react";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import LoadingScreen from "@/components/ui/loading/LoadingScreen";
import {
  getSuratForStaff,
  previewSuratPdf,
  previewSuratPengantar,
  verifySuratByStaff,
} from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";
import { showToast } from "@/utils/toastHelper";

export default function PengajuanSuratPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Modal states
  const {
    isOpen: isVerifikasiOpen,
    onOpen: onVerifikasiOpen,
    onOpenChange: onVerifikasiOpenChange,
  } = useDisclosure();
  const {
    isOpen: isPenolakanOpen,
    onOpen: onPenolakanOpen,
    onOpenChange: onPenolakanOpenChange,
  } = useDisclosure();

  // Form states
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [noSurat, setNoSurat] = useState("");
  const [alasanPenolakan, setAlasanPenolakan] = useState("");
  const [formErrors, setFormErrors] = useState({
    noSurat: "",
    alasanPenolakan: "",
  });

  // Loading states untuk berbagai preview actions
  const [loadingStates, setLoadingStates] = useState({
    previewPdf: null,
    previewPengantar: null,
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat-staff"],
    queryFn: getSuratForStaff,
  });

  // Helper function untuk set loading state
  const setPreviewLoading = (type, suratId = null) => {
    setLoadingStates((prev) => ({
      ...prev,
      [type]: suratId,
    }));
  };

  // Check if any loading is active
  const isAnyLoading = Object.values(loadingStates).some(
    (state) => state !== null,
  );

  // Reset form states
  const resetForms = () => {
    setSelectedSurat(null);
    setNoSurat("");
    setAlasanPenolakan("");
    setFormErrors({ noSurat: "", alasanPenolakan: "" });
  };

  // Validate forms
  const validateVerifikasiForm = () => {
    const errors = { noSurat: "", alasanPenolakan: "" };
    let isValid = true;

    if (!noSurat.trim()) {
      errors.noSurat = "Nomor surat wajib diisi";
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  const validatePenolakanForm = () => {
    const errors = { noSurat: "", alasanPenolakan: "" };
    let isValid = true;

    if (!alasanPenolakan.trim()) {
      errors.alasanPenolakan = "Alasan penolakan wajib diisi";
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  // Function to handle preview PDF with loading
  const handlePreviewPdf = async (suratId) => {
    try {
      setPreviewLoading("previewPdf", suratId);
      const blob = await previewSuratPdf(suratId);
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");
    } catch (err) {
      showToast({
        title: "Gagal Preview",
        description: err.message,
        color: "error",
      });
    } finally {
      setPreviewLoading("previewPdf", null);
    }
  };

  // Function to handle preview surat pengantar with loading
  const handlePreviewPengantar = async (suratId) => {
    try {
      setPreviewLoading("previewPengantar", suratId);
      await previewSuratPengantar(suratId);
    } catch (err) {
      showToast({
        title: "Gagal Preview",
        description: err.message || "Gagal memuat surat pengantar",
        color: "error",
      });
    } finally {
      setPreviewLoading("previewPengantar", null);
    }
  };

  const { mutateAsync: verifikasiSurat, isPending: isVerifying } = useMutation({
    mutationFn: ({ id, noSurat }: { id: string; noSurat: string }) =>
      verifySuratByStaff(id, { status: "DIVERIFIKASI_STAFF", noSurat }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Surat berhasil diverifikasi.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-staff"] });
      onVerifikasiOpenChange();
      resetForms();
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Verifikasi gagal.",
        color: "error",
      });
    },
  });

  const { mutateAsync: tolakSurat, isPending: isRejecting } = useMutation({
    mutationFn: ({ id, alasan }: { id: string; alasan: string }) =>
      verifySuratByStaff(id, {
        status: "DITOLAK_STAFF",
        catatanPenolakan: alasan,
      }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Surat berhasil ditolak.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-staff"] });
      onPenolakanOpenChange();
      resetForms();
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Penolakan gagal.",
        color: "error",
      });
    },
  });

  // Handle verifikasi submit
  const handleVerifikasiSubmit = async () => {
    if (!validateVerifikasiForm()) return;

    await verifikasiSurat({
      id: selectedSurat.id,
      noSurat: noSurat.trim(),
    });
  };

  // Handle penolakan submit
  const handlePenolakanSubmit = async () => {
    if (!validatePenolakanForm()) return;

    await tolakSurat({
      id: selectedSurat.id,
      alasan: alasanPenolakan.trim(),
    });
  };

  const columns = [
    { key: "noSurat", label: "No Surat" },
    { key: "jenisSurat", label: "Jenis Surat" },
    { key: "pemohon", label: "Pemohon" },
    { key: "rtrw", label: "RT / RW" },
    { key: "status", label: "Status" },
    { key: "tanggal", label: "Tanggal" },
    { key: "actions", label: "", align: "end" as const },
  ];

  // Determine loading message based on active loading state
  const getLoadingMessage = () => {
    if (loadingStates.previewPdf) return "Memuat preview PDF...";
    if (loadingStates.previewPengantar) return "Memuat surat pengantar...";

    return "Memuat...";
  };

  const rows = Array.isArray(data)
    ? data.map((item: any) => {
        const sudahDiproses = ["DIVERIFIKASI_STAFF", "DITOLAK_STAFF"].includes(
          item.status,
        );

        return {
          key: item.id,
          noSurat: item.noSurat || "-",
          jenisSurat: item.jenisSurat,
          pemohon: item.namaLengkap,
          rtrw: `${item.rt || "-"} / ${item.rw || "-"}`,
          status: item.status.replace(/_/g, " "),
          tanggal: formatDateIndo(item.tanggalPengajuan),
          actions: (
            <div className="flex items-center gap-2">
              <TableActions
                onView={() => router.push(`/staff/pengajuan/${item.id}`)}
              />
              {!sudahDiproses && (
                <TableActionsInline
                  customActions={[
                    {
                      key: "verifikasi",
                      label: "Verifikasi",
                      icon: CheckCircleIcon,
                      color: "success",
                      render: (
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          isDisabled={isAnyLoading || isVerifying}
                          startContent={<CheckCircleIcon className="w-4 h-4" />}
                          onPress={() => {
                            setSelectedSurat(item);
                            onVerifikasiOpen();
                          }}
                        >
                          Verifikasi
                        </Button>
                      ),
                    },
                    {
                      key: "tolak",
                      label: "Tolak",
                      icon: XCircleIcon,
                      color: "danger",
                      render: (
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isDisabled={isAnyLoading || isRejecting}
                          startContent={<XCircleIcon className="w-4 h-4" />}
                          onPress={() => {
                            setSelectedSurat(item);
                            onPenolakanOpen();
                          }}
                        >
                          Tolak
                        </Button>
                      ),
                    },
                  ]}
                />
              )}

              <TableActionsInline
                customActions={[
                  {
                    key: "preview",
                    label: "Preview PDF",
                    icon: DocumentIcon,
                    color: "primary",
                    onClick: async () => {
                      await handlePreviewPdf(item.id);
                    },
                    render: (
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<DocumentIcon className="w-4 h-4" />}
                        isLoading={loadingStates.previewPdf === item.id}
                        isDisabled={isAnyLoading}
                        onPress={() => handlePreviewPdf(item.id)}
                      >
                        {loadingStates.previewPdf === item.id
                          ? "Loading..."
                          : "Preview PDF"}
                      </Button>
                    ),
                  },
                  {
                    key: "previewPengantar",
                    label: "Preview Pengantar",
                    icon: DocumentTextIcon,
                    onClick: async () => {
                      await handlePreviewPengantar(item.id);
                    },
                    render: (
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        startContent={<DocumentTextIcon className="w-4 h-4" />}
                        isLoading={loadingStates.previewPengantar === item.id}
                        isDisabled={isAnyLoading}
                        onPress={() => handlePreviewPengantar(item.id)}
                      >
                        {loadingStates.previewPengantar === item.id
                          ? "Loading..."
                          : "Preview Pengantar"}
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
          ),
        };
      })
    : [];

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

      {/* Modal Verifikasi */}
      <Modal
        isOpen={isVerifikasiOpen}
        onOpenChange={onVerifikasiOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                  <span>Verifikasi Surat</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-default-600">
                      Anda akan memverifikasi surat berikut:
                    </p>
                    <div className="bg-default-100 p-3 rounded-lg mt-2">
                      <p className="font-medium">{selectedSurat?.jenisSurat}</p>
                      <p className="text-sm text-default-600">
                        Pemohon: {selectedSurat?.namaLengkap}
                      </p>
                    </div>
                  </div>

                  <Input
                    label="Nomor Surat"
                    placeholder="Masukkan nomor surat (contoh: 001/KEL/2024)"
                    value={noSurat}
                    onValueChange={setNoSurat}
                    isInvalid={!!formErrors.noSurat}
                    errorMessage={formErrors.noSurat}
                    isRequired
                    variant="bordered"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    resetForms();
                  }}
                  isDisabled={isVerifying}
                >
                  Batal
                </Button>
                <Button
                  color="success"
                  onPress={handleVerifikasiSubmit}
                  isLoading={isVerifying}
                  startContent={
                    !isVerifying && <CheckCircleIcon className="w-4 h-4" />
                  }
                >
                  {isVerifying ? "Memverifikasi..." : "Verifikasi"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Penolakan */}
      <Modal
        isOpen={isPenolakanOpen}
        onOpenChange={onPenolakanOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <XCircleIcon className="w-6 h-6 text-danger" />
                  <span>Tolak Surat</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-default-600">
                      Anda akan menolak surat berikut:
                    </p>
                    <div className="bg-default-100 p-3 rounded-lg mt-2">
                      <p className="font-medium">{selectedSurat?.jenisSurat}</p>
                      <p className="text-sm text-default-600">
                        Pemohon: {selectedSurat?.namaLengkap}
                      </p>
                    </div>
                  </div>

                  <Textarea
                    label="Alasan Penolakan"
                    placeholder="Jelaskan alasan penolakan surat ini..."
                    value={alasanPenolakan}
                    onValueChange={setAlasanPenolakan}
                    isInvalid={!!formErrors.alasanPenolakan}
                    errorMessage={formErrors.alasanPenolakan}
                    isRequired
                    variant="bordered"
                    minRows={3}
                    maxRows={6}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => {
                    onClose();
                    resetForms();
                  }}
                  isDisabled={isRejecting}
                >
                  Batal
                </Button>
                <Button
                  color="danger"
                  onPress={handlePenolakanSubmit}
                  isLoading={isRejecting}
                  startContent={
                    !isRejecting && <XCircleIcon className="w-4 h-4" />
                  }
                >
                  {isRejecting ? "Menolak..." : "Tolak Surat"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ListGrid
        title="Pengajuan Surat"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff/dashboard" },
          { label: "Pengajuan Surat" },
        ]}
        description="Daftar surat yang diajukan oleh warga dan siap diverifikasi oleh staff."
        columns={columns}
        rows={rows}
        loading={isLoading}
        pageSize={10}
        searchPlaceholder="Cari surat..."
        showPagination
        onSearch={(query) => {
          queryClient.setQueryData(["surat-staff"], (oldData: any) => {
            if (!Array.isArray(oldData)) return oldData;

            return oldData.filter((item: any) =>
              item.jenisSurat.toLowerCase().includes(query.toLowerCase()),
            );
          });
        }}
        empty={
          <EmptyState
            icon={<DocumentIcon className="w-6 h-6" />}
            title="Belum ada pengajuan"
            description="Tidak ada surat baru untuk diverifikasi."
          />
        }
      />
    </>
  );
}
