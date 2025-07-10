"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";

interface TextInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  isRequired?: boolean;
}

export function TextInput({
  name,
  label,
  placeholder = label,
  type = "text",
  disabled,
  isRequired = true,
}: TextInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      {label && (
        <label className="font-medium text-sm">
          {label} {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}{" "}
      <Input
        {...register(name)}
        disabled={disabled}
        isInvalid={!!error}
        placeholder={"Masukkan " + placeholder}
        required={isRequired}
        type={type}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
