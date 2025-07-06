"use client";

import { Button } from "@heroui/react"; // asumsi kamu pakai komponen dari Hero UI
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: () => void;
  actionLabel?: string;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There are no items to display at the moment.",
  icon,
  action,
  actionLabel,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm animate-in fade-in-50",
        className,
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-primary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">{description}</p>
      {action && actionLabel && (
        <div className="mt-6">
          <Button onClick={action}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
