"use client";

import { useFormContext } from "react-hook-form";
import { Select, SelectItem } from "@heroui/react";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean; // default: true
  isLoading?: boolean; // optional, for async loading
}

export function SelectInput({
  name,
  label,
  options,
  placeholder = "Pilih opsi",
  disabled,
  isRequired = true,
  isLoading = false,
}: SelectInputProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
  const value = watch(name); // watch selected value

  return (
    <div className="space-y-1">
      {label && (
        <label className="font-medium text-sm">
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <Select
        aria-label={name}
        isDisabled={disabled}
        isInvalid={!!error}
        isLoading={isLoading}
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        // selectedKeys={value}
        onSelectionChange={(val) => setValue(name, val as string)}
      >
        {options.map((opt) => (
          <SelectItem key={opt.value}>{opt.label}</SelectItem>
        ))}
      </Select>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
