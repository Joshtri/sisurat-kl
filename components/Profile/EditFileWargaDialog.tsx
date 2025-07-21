"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadWargaIdentity } from "@/services/wargaService";

interface Props {
  wargaId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditFileWargaDialog({
  isOpen,
  wargaId,
  onClose,
}: Props) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  console.log(wargaId);

  const { mutate: uploadFiles, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const fileKtp = formData.get("fileKtp") as File | null;
      const fileKk = formData.get("fileKk") as File | null;

      return uploadWargaIdentity(
        wargaId,
        fileKtp ?? undefined,
        fileKk ?? undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warga", wargaId] });
      handleClose();
    },
    onError: (err) => {
      console.error("Upload gagal:", err);
      // optionally show toast
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitForm = async (data: any) => {
    const formData = new FormData();

    if (data.fileKtp?.[0]) formData.append("fileKtp", data.fileKtp[0]);
    if (data.fileKk?.[0]) formData.append("fileKk", data.fileKk[0]);
    formData.append("userId", wargaId);

    uploadFiles(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      backdrop="opaque"
      size="md"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>Lengkapi Berkas</ModalHeader>
        <form onSubmit={handleSubmit(submitForm)}>
          <ModalBody className="space-y-4">
            <div className="space-y-1">
              <Input
                label="Upload KTP"
                type="file"
                accept="application/pdf,image/*"
                {...register("fileKtp")}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Upload Kartu Keluarga"
                type="file"
                accept="application/pdf,image/*"
                {...register("fileKk")}
                className="w-full"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="default" variant="light" onClick={handleClose}>
              Batal
            </Button>
            <Button color="primary" type="submit" isLoading={isPending}>
              Simpan
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
