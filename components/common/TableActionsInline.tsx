// components/common/TableActionsInline.tsx
"use client";

import { Button } from "@heroui/react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState, ComponentType, SVGProps } from "react";

import { ConfirmationDialog } from "./ConfirmationDialog";

interface CustomAction {
  key: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void | Promise<void>;
  color?: "default" | "primary" | "danger" | "success" | "warning";
  render?: React.ReactNode; // ✅ tambahkan ini
}

interface TableActionsInlineProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    loadingText?: string;
    onConfirm: () => Promise<void> | void;
  };
  customActions?: CustomAction[];
}

export function TableActionsInline({
  onView,
  onEdit,
  onDelete,
  customActions = [],
}: TableActionsInlineProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="flex gap-2 justify-end items-center">
      {onView && (
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={onView}
          startContent={<EyeIcon className="w-4 h-4" />}
        >
          Lihat
        </Button>
      )}
      {onEdit && (
        <Button
          size="sm"
          variant="flat"
          color="warning"
          onPress={onEdit}
          startContent={<PencilSquareIcon className="w-4 h-4" />}
        >
          Edit
        </Button>
      )}
      {onDelete && (
        <>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            startContent={<TrashIcon className="w-4 h-4" />}
            onPress={() => setShowDeleteDialog(true)}
          >
            Hapus
          </Button>
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
        </>
      )}

      {customActions.map((action) =>
        action.render ? (
          <div key={action.key}>{action.render}</div>
        ) : (
          <Button
            key={action.key}
            size="sm"
            variant="flat"
            color={action.color ?? "default"}
            onPress={action.onClick}
            startContent={<action.icon className="w-4 h-4" />}
          >
            {action.label}
          </Button>
        ),
      )}
    </div>
  );
}
