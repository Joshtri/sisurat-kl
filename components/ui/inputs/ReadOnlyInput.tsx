import React from "react";

interface ReadOnlyInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  className?: string;
}

export function ReadOnlyInput({
  label,
  value,
  placeholder = "-",
  className = "",
}: ReadOnlyInputProps) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 border border-gray-300">
        {value?.trim() ? (
          value
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
    </div>
  );
}
