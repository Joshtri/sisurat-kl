"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@heroui/react";
import React from "react";

interface FileInputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  accept?: string;
  helperText?: string;
}

export function FileInput({
  name,
  label,
  isRequired = true,
  accept,
  helperText,
}: FileInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      {label && (
        <label className="font-medium text-sm">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            type="file"
            accept={accept}
            isInvalid={!!error}
            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
          />
        )}
      />
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
