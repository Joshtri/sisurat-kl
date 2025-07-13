"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectItem } from "@heroui/react";

interface Option {
  label: string;
  value: string | boolean | number;
}

interface SelectInputProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  onChange?: (value: string | boolean | number) => void; // ✅ tambahkan ini
}

export function SelectInput({
  name,
  label,
  options,
  placeholder = "Pilih opsi",
  disabled,
  isRequired = true,
  isLoading = false,
  onChange,
}: SelectInputProps) {
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
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            aria-label={name}
            isDisabled={disabled}
            isInvalid={!!error}
            isLoading={isLoading}
            placeholder={placeholder}
            selectedKeys={new Set([String(field.value)])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              let newValue: any = selected;

              if (selected === "true") newValue = true;
              else if (selected === "false") newValue = false;

              field.onChange(newValue); // ✅ untuk react-hook-form
              onChange?.(newValue); // ✅ untuk custom handler dari luar
            }}
          >
            {options.map((opt) => (
              <SelectItem key={String(opt.value)}>{opt.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
