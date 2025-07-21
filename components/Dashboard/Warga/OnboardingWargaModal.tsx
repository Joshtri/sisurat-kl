// /components/modals/OnboardingModal.tsx
"use client";

import {
  DocumentIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { completeOnboarding } from "@/services/userCompletionService";
import { showToast } from "@/utils/toastHelper";

interface OnboardingModalProps {
  isOpen: boolean;
  userData: {
    email: string | null;
    numberWhatsApp: string | null;
  };
  profilData: {
    fileKtp: string | null;
    fileKk: string | null;
  } | null;
  onComplete: () => void;
}

interface FormData {
  email: string;
  numberWhatsApp: string;
  fileKtp: FileList;
  fileKk: FileList;
}

export default function OnboardingWargaModal({
  isOpen,
  userData,
  profilData,
  onComplete,
}: OnboardingModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      email: userData.email || "",
      numberWhatsApp: userData.numberWhatsApp || "",
    },
  });

  const { mutate: completeOnboardingMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      // Append basic data
      formData.append("email", data.email);
      formData.append("numberWhatsApp", data.numberWhatsApp);

      // Append files
      if (data.fileKtp?.[0]) {
        formData.append("fileKtp", data.fileKtp[0]);
      }
      if (data.fileKk?.[0]) {
        formData.append("fileKk", data.fileKk[0]);
      }

      return completeOnboarding(formData);
    },
    onSuccess: () => {
      showToast({
        title: "Berhasil!",
        description: "Data Anda telah dilengkapi. Selamat datang!",
        color: "success",
      });

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["user-completion"] });

      reset();
      onComplete();
    },
    onError: (error: any) => {
      showToast({
        title: "Gagal!",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data",
        color: "error",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    completeOnboardingMutation(data);
  };

  // Watch file inputs untuk validasi
  const fileKtpWatch = watch("fileKtp");
  const fileKkWatch = watch("fileKk");

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false} // Tidak bisa ditutup dengan klik luar
      hideCloseButton={true} // Sembunyikan tombol close
      backdrop="blur"
      size="2xl"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-warning-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Lengkapi Data Anda</h2>
              <p className="text-sm text-default-500 font-normal">
                Sebelum menggunakan layanan, mohon lengkapi data berikut
              </p>
            </div>
          </div>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="gap-4">
            {/* Alert */}
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning-800">
                    Perhatian Penting
                  </p>
                  <p className="text-warning-700 mt-1">
                    Data ini diperlukan untuk verifikasi identitas dan pengajuan
                    surat. Pastikan semua informasi yang Anda masukkan adalah
                    benar dan valid.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <Input
                label="Email"
                placeholder="Masukkan alamat email Anda"
                type="email"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Format email tidak valid",
                  },
                })}
                startContent={
                  <EnvelopeIcon className="w-4 h-4 text-default-400" />
                }
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                isRequired
                description="Email akan digunakan untuk notifikasi status surat"
              />

              {/* Nomor WhatsApp */}
              <Input
                label="Nomor WhatsApp"
                placeholder="Contoh: 08123456789"
                {...register("numberWhatsApp", {
                  required: "Nomor WhatsApp wajib diisi",
                  pattern: {
                    value: /^[\d+\-\s()]+$/,
                    message: "Format nomor tidak valid",
                  },
                })}
                startContent={
                  <PhoneIcon className="w-4 h-4 text-default-400" />
                }
                isInvalid={!!errors.numberWhatsApp}
                errorMessage={errors.numberWhatsApp?.message}
                isRequired
                description="Nomor aktif untuk komunikasi langsung"
              />

              {/* File KTP */}
              <div className="space-y-1">
                <Input
                  label="Upload File KTP"
                  type="file"
                  accept="application/pdf,image/*"
                  {...register("fileKtp", {
                    required: "File KTP wajib diupload",
                  })}
                  startContent={
                    <DocumentIcon className="w-4 h-4 text-default-400" />
                  }
                  isInvalid={!!errors.fileKtp}
                  errorMessage={errors.fileKtp?.message}
                  isRequired
                  description="Upload scan/foto KTP yang jelas (PDF/Image)"
                />
                {fileKtpWatch?.[0] && (
                  <p className="text-xs text-success-600">
                    ✓ File terpilih: {fileKtpWatch[0].name}
                  </p>
                )}
              </div>

              {/* File Kartu Keluarga */}
              <div className="space-y-1">
                <Input
                  label="Upload File Kartu Keluarga"
                  type="file"
                  accept="application/pdf,image/*"
                  {...register("fileKk", {
                    required: "File Kartu Keluarga wajib diupload",
                  })}
                  startContent={
                    <DocumentIcon className="w-4 h-4 text-default-400" />
                  }
                  isInvalid={!!errors.fileKk}
                  errorMessage={errors.fileKk?.message}
                  isRequired
                  description="Upload scan/foto Kartu Keluarga (PDF/Image)"
                />
                {fileKkWatch?.[0] && (
                  <p className="text-xs text-success-600">
                    ✓ File terpilih: {fileKkWatch[0].name}
                  </p>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              isLoading={isPending}
              isDisabled={isPending}
              className="w-full"
            >
              {isPending ? "Mengunggah..." : "Lengkapi Data"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
