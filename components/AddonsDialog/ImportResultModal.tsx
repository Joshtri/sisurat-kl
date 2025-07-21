// /components/modals/ImportResultModal.tsx
"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ImportResult } from "@/services/userExcelService";

interface ImportResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ImportResult | null;
}

export default function ImportResultModal({
  isOpen,
  onClose,
  result,
}: ImportResultModalProps) {
  if (!result) return null;

  const successCount = result.success.length;
  const errorCount = result.errors.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <InformationCircleIcon className="w-6 h-6 text-primary" />
          <span>Hasil Import Data</span>
        </ModalHeader>

        <ModalBody>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {result.total}
              </div>
              <div className="text-sm text-blue-600">Total Baris</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {successCount}
              </div>
              <div className="text-sm text-green-600">Berhasil</div>
            </div>

            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {errorCount}
              </div>
              <div className="text-sm text-red-600">Gagal</div>
            </div>
          </div>

          <Divider className="my-4" />

          {/* Success List */}
          {successCount > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-green-600 mb-3">
                <CheckCircleIcon className="w-5 h-5" />
                Berhasil Diimport ({successCount})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {result.success.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-green-50 rounded border-l-4 border-green-400"
                  >
                    <div className="text-sm font-medium text-green-800">
                      Baris {item.row}:
                    </div>
                    <div className="text-sm text-green-700">
                      <strong>{item.username}</strong> - {item.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error List */}
          {errorCount > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-3">
                <XCircleIcon className="w-5 h-5" />
                Gagal Diimport ({errorCount})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {result.errors.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-red-50 rounded border-l-4 border-red-400"
                  >
                    <div className="text-sm font-medium text-red-800">
                      Baris {item.row}:
                    </div>
                    <div className="text-sm text-red-700">{item.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Username harus unik dan tidak boleh kosong</li>
              <li>• Email dan Nomor WhatsApp bersifat opsional</li>
              <li>
                • Role harus salah satu dari: WARGA, RT, STAFF, LURAH,
                SUPERADMIN
              </li>
              <li>• Password minimal 6 karakter</li>
            </ul>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
