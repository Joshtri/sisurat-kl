"use client";

import { Button } from "@heroui/react";

interface CreateOrEditButtonsProps {
  isLoading?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
  showCancel?: boolean;
  submitType?: "submit" | "button";
}

export function CreateOrEditButtons({
  isLoading = false,
  isEditMode = false,
  onCancel,
  cancelLabel = "Batal",
  showCancel = true,
  submitType = "submit",
}: CreateOrEditButtonsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-6">
      {showCancel && (
        <Button type="button" variant="light" onPress={onCancel}>
          {cancelLabel}
        </Button>
      )}
      <Button
        color="primary"
        type={submitType}
        isLoading={isLoading}
        className="min-w-[100px]"
      >
        {isLoading
          ? isEditMode
            ? "Menyimpan..."
            : "Membuat..."
          : isEditMode
            ? "Perbarui"
            : "Simpan"}
      </Button>
    </div>
  );
}
