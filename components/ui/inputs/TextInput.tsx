"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";
import { InputHTMLAttributes, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { isValidNIK, isValidRTRW } from "@/utils/common";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  showPasswordToggle?: boolean;
  helperText?: string; // <- tambahkan ini
  isNumber?: boolean; // <- tambah ini
}

export function TextInput({
  name,
  label,
  placeholder = label,
  type = "text",
  isDisabled = false,
  isRequired = true,
  showPasswordToggle = false,
  className = "",
  helperText,
  ...rest
}: TextInputProps) {
  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const error = errors[name]?.message as string | undefined;

  // Validasi frontend manual (khusus nik, rt, rw)
  const validateManually = (val: string) => {
    if (name === "nik" && !isValidNIK(val)) {
      setError(name, { type: "manual", message: "NIK harus 16 digit angka" });
    } else if ((name === "rt" || name === "rw") && !isValidRTRW(val)) {
      setError(name, {
        type: "manual",
        message: "Harus 3 digit angka (contoh: 001)",
      });
    } else {
      clearErrors(name);
    }
  };

  // Determine input type based on password toggle
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`space-y-2 mb-3`}>
      {" "}
      {/* ✅ Tambahkan mb-4 */}
      {label && (
        <label className="font-medium text-sm">
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          {...register(name)}
          disabled={isDisabled}
          isInvalid={!!error}
          placeholder={`Masukkan ${placeholder}`}
          required={isRequired}
          type={inputType}
          maxLength={rest.maxLength}
          onBlur={(e) => {
            validateManually(e.target.value);
            rest.onBlur?.(e);
          }}
          onKeyDown={(e) => {
            if (rest.onKeyDown) rest.onKeyDown(e);
            if (rest.isNumber) {
              const allowedKeys = [
                "Backspace",
                "Tab",
                "ArrowLeft",
                "ArrowRight",
                "Delete",
              ];

              if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }
          }}
          className={`
          w-full transition-all duration-150 rounded-xl
          ${error ? "border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${showPasswordToggle && type === "password" ? "pr-10" : ""}
          ${className}
        `}
          size="md"
          {...Object.fromEntries(
            Object.entries(rest).filter(
              ([key]) => key !== "size" && key !== "isNumber",
            ),
          )}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
