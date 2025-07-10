"use client";

import { useFormContext } from "react-hook-form";
import { Select, SelectItem } from "@heroui/react";

interface Option {
  label: string;
  value: string | number;
}

interface DropdownInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
}

export function DropdownInput({
  name,
  label,
  placeholder = "Pilih salah satu",
  options,
  disabled,
}: DropdownInputProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedValue = watch(name);
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      {label && <label className="font-medium text-sm">{label}</label>}
      <Select
        aria-label={label ?? name}
        isDisabled={disabled}
        isInvalid={!!error}
        placeholder={placeholder}
        selectedKeys={selectedValue ? [selectedValue] : []}
        onChange={(e) => setValue(name, e.target.value)}
      >
        {options.map((opt) => (
          <SelectItem key={opt.value}>{opt.label}</SelectItem>
        ))}
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
