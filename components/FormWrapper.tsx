"use client";

import { ReactNode } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@heroui/react"; // Gunakan spinner dari HeroUI

interface FormWrapperProps<T extends FieldValues> {
  children: ReactNode;
  schema: any;
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  isLoading?: boolean; // ✅ Tambahkan prop ini
}

export function FormWrapper<T extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
  className,
  isLoading = false, // ✅ Default ke false
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        className={`relative ${className ?? "space-y-4"}`}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {/* Form content with opacity if loading */}
        <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
          {children}
        </div>

        {/* Overlay loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <Spinner className="w-6 h-6 text-primary animate-spin" />
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
