"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useState } from "react";

export function EditUserDialog({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: { username: string; email?: string; role: string };
}) {
  const [form, setForm] = useState(user);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("UPDATE USER:", form);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Profil Akun</ModalHeader>
        <ModalBody className="space-y-3">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Username"
          />
          <input
            name="email"
            value={form.email ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
          />
        </ModalBody>
        <ModalFooter className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600 px-4 py-2">
            Batal
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Simpan
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
