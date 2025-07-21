"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input, Button } from "@heroui/react";
import { useState, useEffect } from "react";

export function EditUserDialog({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: {
    username: string;
    email?: string;
    role: string;
    numberWhatsApp?: string;
  };
}) {
  const [form, setForm] = useState(user);

  // Reset form saat dialog dibuka kembali
  useEffect(() => {
    if (open) setForm(user);
  }, [open, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("UPDATE USER:", form);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Profil Akun</ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            placeholder="Masukkan username"
          />
          <Input
            name="email"
            label="Email"
            value={form.email ?? ""}
            onChange={handleChange}
            placeholder="Masukkan email"
          />
          <Input
            name="numberWhatsApp"
            label="Nomor WhatsApp"
            value={form.numberWhatsApp ?? ""}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />
        </ModalBody>
        <ModalFooter className="flex justify-end space-x-2">
          <Button variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button color="primary" onPress={handleSave}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
