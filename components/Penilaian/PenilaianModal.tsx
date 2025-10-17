"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { StarRating } from "@/components/ui/StarRating";
import { createPenilaian, TahapPenilaian } from "@/services/penilaianService";
import { showToast } from "@/utils/toastHelper";

interface PenilaianModalProps {
  isOpen: boolean;
  onClose: () => void;
  suratId: string;
  suratNomor?: string;
  tahapRole: TahapPenilaian;
}

export function PenilaianModal({
  isOpen,
  onClose,
  suratId,
  suratNomor,
  tahapRole,
}: PenilaianModalProps) {
  const [rating, setRating] = useState(0);
  const [deskripsi, setDeskripsi] = useState("");
  const queryClient = useQueryClient();

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setDeskripsi("");
    }
  }, [isOpen]);

  const { mutate: submitPenilaian, isPending } = useMutation({
    mutationFn: createPenilaian,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: `Penilaian untuk tahap ${tahapRole} berhasil disimpan`,
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["surat-history"] });
      queryClient.invalidateQueries({ queryKey: ["penilaian", suratId] });
      onClose();
    },
    onError: (error: any) => {
      showToast({
        title: "Gagal",
        description: error?.response?.data?.message || "Gagal menyimpan penilaian",
        color: "error",
      });
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      showToast({
        title: "Perhatian",
        description: "Silakan pilih rating terlebih dahulu",
        color: "warning",
      });

      return;
    }

    submitPenilaian({
      idSurat: suratId,
      tahapRole,
      rating,
      deskripsi: deskripsi.trim() || undefined,
    });
  };

  const getTahapLabel = () => {
    switch (tahapRole) {
      case "RT":
        return "RT";
      case "STAFF":
        return "Staf";
      case "LURAH":
        return "Lurah";
      default:
        return tahapRole;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Beri Penilaian - Tahap {getTahapLabel()}
          {suratNomor && (
            <p className="text-sm font-normal text-default-500">
              Surat: {suratNomor}
            </p>
          )}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-default-700 mb-2 block">
                Rating <span className="text-danger">*</span>
              </label>
              <div className="flex justify-center py-2">
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-default-500 mt-2">
                  {rating === 5 && "Sangat Puas"}
                  {rating === 4 && "Puas"}
                  {rating === 3 && "Cukup"}
                  {rating === 2 && "Kurang"}
                  {rating === 1 && "Sangat Kurang"}
                </p>
              )}
            </div>

            <div>
              <Textarea
                label="Deskripsi (Opsional)"
                placeholder="Berikan komentar atau saran Anda..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                minRows={3}
                maxRows={6}
                maxLength={500}
                description={`${deskripsi.length}/500 karakter`}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isPending}
            isDisabled={rating === 0}
          >
            Simpan Penilaian
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
