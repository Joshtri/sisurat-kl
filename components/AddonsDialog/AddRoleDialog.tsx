"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import { showToast } from "@/utils/toastHelper";
import { updateUserRoles } from "@/services/userService";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRoles: Role[];
}

const ONLY_EXTRA_ROLE: Role = "WARGA"; // hanya boleh menambah akses WARGA

export default function AddRoleModal({
  isOpen,
  onClose,
  userId,
  currentRoles,
}: AddRoleModalProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSelected(currentRoles.includes(ONLY_EXTRA_ROLE));
    }
  }, [isOpen, currentRoles]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const roles = isSelected ? [ONLY_EXTRA_ROLE] : [];
      await updateUserRoles(userId, roles);
      showToast({
        title: "Berhasil",
        description: "Akses warga berhasil diperbarui.",
        color: "success",
      });
      onClose();
    } catch (error) {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui akses warga.",
        color: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader>Tambah Akses Warga</ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-600 mb-3">
                Pengguna dengan peran <strong>RT</strong>,{" "}
                <strong>STAFF</strong>, atau <strong>LURAH</strong> yang juga
                merupakan warga Kelurahan Liliba dapat diberikan akses tambahan
                sebagai <strong>WARGA</strong>. Hal ini memungkinkan mereka
                untuk berpindah dashboard ke mode warga.
              </p>

              <div className="flex items-center gap-2">
                <Checkbox
                  isSelected={isSelected}
                  onChange={() => setIsSelected(!isSelected)}
                  value="WARGA"
                >
                  Tambahkan akses sebagai WARGA
                </Checkbox>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onCloseModal}
                isDisabled={isLoading}
              >
                Batal
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleSubmit}
              >
                Simpan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
