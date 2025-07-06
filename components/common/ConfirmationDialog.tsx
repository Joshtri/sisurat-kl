"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { ReactNode, useState, cloneElement, isValidElement } from "react";

interface ConfirmationDialogProps {
  trigger: ReactNode;
  title?: string;
  message?: string;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  loadingText?: string;
  confirmColor?: "primary" | "danger" | "default" | "success" | "warning";
  placement?:
    | "auto"
    | "top"
    | "bottom"
    | "center"
    | "top-center"
    | "bottom-center";
}

export function ConfirmationDialog({
  trigger,
  title = "Konfirmasi Aksi",
  message = "Apakah kamu yakin ingin melanjutkan aksi ini?",
  icon,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  onConfirm,
  loadingText = "Memproses...",
  confirmColor = "primary",
  placement = "center",
}: ConfirmationDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(); // Close the modal after successful confirmation
    } catch (error) {
      // Don't close the modal on error, but log it
      // eslint-disable-next-line no-console
      console.error("Error during confirmation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clone the trigger element and add our onClick handler
  const triggerWithHandler = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        },
      })
    : trigger;

  return (
    <>
      {triggerWithHandler}

      <Modal isOpen={isOpen} placement={placement} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                {icon && <span className="text-xl">{icon}</span>}
                <span>{title}</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600">{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button isDisabled={loading} variant="light" onPress={onClose}>
                  {cancelLabel}
                </Button>
                <Button
                  color={confirmColor}
                  isLoading={loading}
                  onPress={handleConfirm}
                >
                  {loading ? loadingText : confirmLabel}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
