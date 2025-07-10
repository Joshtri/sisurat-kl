"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";

interface NumberInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function NumberInput({
  name,
  label,
  placeholder,
  disabled,
}: NumberInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      {label && <label className="font-medium text-sm">{label}</label>}
      <Input
        {...register(name, { valueAsNumber: true })}
        disabled={disabled}
        isInvalid={!!error}
        placeholder={placeholder}
        type="number"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
