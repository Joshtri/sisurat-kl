"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { useState } from "react";

import { showToast } from "@/utils/toastHelper";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export function ChangePasswordDialog({ open, onClose, userId }: Props) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return showToast({
        title: "Error",
        description: "Semua field wajib diisi",
        color: "error",
      });
    }

    if (form.newPassword !== form.confirmPassword) {
      return showToast({
        title: "Error",
        description: "Password baru dan konfirmasi tidak sama",
        color: "error",
      });
    }

    console.log("Kirim ke API:", {
      userId,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    showToast({
      title: "Berhasil",
      description: "Password berhasil diubah",
      color: "success",
    });

    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Ganti Password</ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            type="password"
            name="currentPassword"
            label="Password Lama"
            placeholder="Masukkan password lama"
            value={form.currentPassword}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="newPassword"
            label="Password Baru"
            placeholder="Masukkan password baru"
            value={form.newPassword}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="confirmPassword"
            label="Konfirmasi Password Baru"
            placeholder="Ulangi password baru"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </ModalBody>
        <ModalFooter className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Simpan
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
