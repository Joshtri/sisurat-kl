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

  // Helper function untuk format ukuran file
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Validasi file
  const validateFile = (fileList: FileList | null, fieldName: string) => {
    if (!fileList || fileList.length === 0) {
      return `File ${fieldName} wajib diupload`;
    }

    const file = fileList[0];
    const maxSize = 1024 * 1024; // 1MB dalam bytes

    // Validasi ukuran
    if (file.size > maxSize) {
      return `Ukuran file ${fieldName} maksimal 1MB. File Anda: ${formatFileSize(file.size)}`;
    }

    // Validasi tipe file
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return `Format file ${fieldName} tidak didukung. Gunakan: JPG, PNG, GIF, atau PDF`;
    }

    return true;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    clearErrors,
    setError,
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
    // Validasi file sebelum submit
    const ktpValidation = validateFile(data.fileKtp, "KTP");
    const kkValidation = validateFile(data.fileKk, "Kartu Keluarga");

    if (ktpValidation !== true) {
      setError("fileKtp", {
        type: "manual",
        message: ktpValidation,
      });
      return;
    }

    if (kkValidation !== true) {
      setError("fileKk", {
        type: "manual",
        message: kkValidation,
      });
      return;
    }

    completeOnboardingMutation(data);
  };

  // Watch file inputs untuk validasi realtime
  const fileKtpWatch = watch("fileKtp");
  const fileKkWatch = watch("fileKk");

  // Handle file change untuk validasi realtime
  const handleFileChange =
    (fieldName: "fileKtp" | "fileKk") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      const validation = validateFile(
        files,
        fieldName === "fileKtp" ? "KTP" : "Kartu Keluarga"
      );

      if (validation === true) {
        clearErrors(fieldName);
      } else {
        setError(fieldName, {
          type: "manual",
          message: validation,
        });
      }
    };

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
                  accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif"
                  {...register("fileKtp", {
                    required: "File KTP wajib diupload",
                    onChange: handleFileChange("fileKtp"),
                  })}
                  startContent={
                    <DocumentIcon className="w-4 h-4 text-default-400" />
                  }
                  isInvalid={!!errors.fileKtp}
                  errorMessage={errors.fileKtp?.message}
                  isRequired
                  description="Upload scan/foto KTP yang jelas (PDF/JPG/PNG/GIF, maks. 1MB)"
                />
                {fileKtpWatch?.[0] && !errors.fileKtp && (
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-success-600">
                      ✓ File terpilih: {fileKtpWatch[0].name}
                    </p>
                    <p className="text-default-500">
                      {formatFileSize(fileKtpWatch[0].size)}
                    </p>
                  </div>
                )}
              </div>

              {/* File Kartu Keluarga */}
              <div className="space-y-1">
                <Input
                  label="Upload File Kartu Keluarga"
                  type="file"
                  accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif"
                  {...register("fileKk", {
                    required: "File Kartu Keluarga wajib diupload",
                    onChange: handleFileChange("fileKk"),
                  })}
                  startContent={
                    <DocumentIcon className="w-4 h-4 text-default-400" />
                  }
                  isInvalid={!!errors.fileKk}
                  errorMessage={errors.fileKk?.message}
                  isRequired
                  description="Upload scan/foto Kartu Keluarga (PDF/JPG/PNG/GIF, maks. 1MB)"
                />
                {fileKkWatch?.[0] && !errors.fileKk && (
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-success-600">
                      ✓ File terpilih: {fileKkWatch[0].name}
                    </p>
                    <p className="text-default-500">
                      {formatFileSize(fileKkWatch[0].size)}
                    </p>
                  </div>
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
