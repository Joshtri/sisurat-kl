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

interface FormWrapperProps<T extends FieldValues> {
  children: ReactNode;
  schema: any; // Zod schema - keeping as any for compatibility
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
}

export function FormWrapper<T extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        className={className ?? "space-y-4"}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
