import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  isLoading?: boolean;
  skeleton?: ReactNode;
  title?: ReactNode;
  className?: string;
}

export function CardContainer({
  children,
  isLoading = false,
  skeleton,
  title,
  className = "",
}: CardContainerProps) {
  return (
    <div className={`max-w-5xl mx-auto p-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-8">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {isLoading ? skeleton : children}
      </div>
    </div>
  );
}
