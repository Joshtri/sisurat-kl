import { ReactNode } from "react";

export function CardContainer({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-8">{children}</div>
    </div>
  );
}
