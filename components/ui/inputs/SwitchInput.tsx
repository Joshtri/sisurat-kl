"use client";

import { useFormContext } from "react-hook-form";
import { Switch } from "@heroui/react";

interface SwitchInputProps {
  name: string;
  label: string;
  isDisabled?: boolean;
  description?: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export function SwitchInput({
  name,
  label,
  isDisabled = false,
  description,
  color = "primary",
}: SwitchInputProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="font-medium text-sm">{label}</label>
          {error && <span className="text-xs text-red-500 pt-1">{error}</span>}
        </div>

        <Switch
          isSelected={!!value}
          onValueChange={(val) => setValue(name, val, { shouldValidate: true })}
          isDisabled={isDisabled}
          color={color}
        />
      </div>

      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}
