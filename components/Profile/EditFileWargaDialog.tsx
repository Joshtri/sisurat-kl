"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button"; // opsional
import { useForm } from "react-hook-form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export default function EditFileWargaDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: Props) {
  const { register, handleSubmit, reset } = useForm();

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitForm = (data: any) => {
    const formData = new FormData();

    if (data.fileKtp) formData.append("fileKtp", data.fileKtp[0]);
    if (data.fileKk) formData.append("fileKk", data.fileKk[0]);
    onSubmit(formData);
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
            <Button color="primary" type="submit" isLoading={isLoading}>
              Simpan
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
