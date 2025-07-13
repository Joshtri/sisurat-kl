"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface Option {
  label: string;
  value: string | boolean | number;
  description?: string;
}

interface AutocompleteInputProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  onChange?: (value: string | boolean | number) => void;
}

export function AutoCompleteInput({
  name,
  label,
  options,
  placeholder = "Ketik atau pilih...",
  disabled,
  isRequired = true,
  isLoading = false,
  onChange,
}: AutocompleteInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const labelId = `${name}-label`;

  return (
    <div className="space-y-1">
      {label && (
        <label id={labelId} className="font-medium text-sm">
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Autocomplete
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? name : undefined}
            isDisabled={disabled}
            isInvalid={!!error}
            isLoading={isLoading}
            placeholder={placeholder}
            selectedKey={String(field.value)}
            onSelectionChange={(key) => {
              const selected = key as string;
              let newValue: any = selected;

              if (selected === "true") newValue = true;
              else if (selected === "false") newValue = false;

              field.onChange(newValue); // react-hook-form
              onChange?.(newValue); // optional custom handler
            }}
          >
            {options.map((opt) => (
              <AutocompleteItem key={String(opt.value)}>
                {opt.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        )}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
