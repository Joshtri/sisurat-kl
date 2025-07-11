"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: (() => void) | React.ReactNode;
  onDelete?: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    loadingText?: string;
    onConfirm: () => Promise<void> | void;
  };
}

export function TableActions({ onView, onEdit, onDelete }: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hasActions = onView || onEdit || onDelete;

  if (!hasActions) return null;

  const handleAction = (action: string) => {
    switch (action) {
      case "view":
        onView?.();
        break;
      case "edit":
        if (typeof onEdit === "function") onEdit();
        break;
      case "delete":
        setShowDeleteDialog(true);
        break;
    }
  };

  const items = [
    ...(onView ? [{ key: "view", label: "Lihat", icon: EyeIcon }] : []),
    ...(onEdit && typeof onEdit === "function"
      ? [{ key: "edit", label: "Edit", icon: PencilSquareIcon }]
      : []),
    ...(onDelete
      ? [{ key: "delete", label: "Hapus", icon: TrashIcon, danger: true }]
      : []),
  ];

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Aksi Tabel"
          className="min-w-[160px]"
          onAction={(key) => handleAction(key as string)}
        >
          {items.map((item) => (
            <DropdownItem
              key={item.key}
              className={item.danger ? "text-red-600" : ""}
              startContent={
                <item.icon
                  className={`w-5 h-5 ${
                    item.danger ? "text-red-500" : "text-gray-500"
                  }`}
                />
              }
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Custom Edit as ReactNode (outside menu) */}
      {onEdit && typeof onEdit !== "function" && (
        <div className="inline-block ml-2">{onEdit}</div>
      )}

      {/* Confirmation Dialog */}
      {onDelete && (
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          confirmColor="danger"
          confirmLabel={onDelete.confirmLabel ?? "Hapus"}
          loadingText={onDelete.loadingText ?? "Menghapus..."}
          title={onDelete.title ?? "Konfirmasi Hapus"}
          message={
            onDelete.message ?? "Apakah Anda yakin ingin menghapus item ini?"
          }
          icon={<TrashIcon className="h-5 w-5 text-red-600" />}
          onConfirm={async () => {
            await onDelete.onConfirm();
            setShowDeleteDialog(false);
          }}
        />
      )}
    </>
  );
}
