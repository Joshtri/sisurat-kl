"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@heroui/input";

interface TextareaInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function TextAreaInput({
  name,
  label,
  placeholder = "",
  isRequired = true,
  disabled = false,
  rows = 4,
}: TextareaInputProps) {
  const {
    register,
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
      <Textarea
        {...register(name)}
        placeholder={placeholder}
        isInvalid={!!error}
        disabled={disabled}
        rows={rows}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
