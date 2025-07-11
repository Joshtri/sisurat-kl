"use client";

import React from "react";

interface ReadOnlyInputProps {
  label?: string;
  value?: string | React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function ReadOnlyInput({
  label,
  value,
  placeholder = "-",
  className = "",
}: ReadOnlyInputProps) {
  const isEmpty = typeof value === "string" ? !value.trim() : !value;

  return (
    <div className={`flex flex-col space-y-1 mb-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="rounded-md bg-gray-100 px-3 py-2 text-sm border border-gray-300">
        {isEmpty ? <span className="text-gray-400">{placeholder}</span> : value}
      </div>
    </div>
  );
}
