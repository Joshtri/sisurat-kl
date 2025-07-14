import React from "react";
import { StatusSurat } from "@prisma/client";

interface SuratProgressProps {
  status: StatusSurat;
}

const steps = ["RT", "STAFF", "LURAH"];

const statusIndexMap: Record<StatusSurat, number> = {
  DIAJUKAN: 0,
  DITOLAK_RT: 0,
  DIVERIFIKASI_RT: 1,
  DITOLAK_STAFF: 1,
  DIVERIFIKASI_STAFF: 2,
  DITOLAK_LURAH: 2,
  DIVERIFIKASI_LURAH: 3,
  DITERBITKAN: 3,
};

export default function SuratProgress({ status }: SuratProgressProps) {
  const currentStep = statusIndexMap[status];

  return (
    <div className="flex items-center space-x-2 mt-4 flex-wrap">
      {steps.map((step, idx) => {
        const isActive = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  isActive
                    ? "bg-green-500 border-green-500"
                    : isCurrent
                      ? "bg-yellow-400 border-yellow-500 animate-pulse"
                      : "bg-gray-200 border-gray-300"
                }`}
              />
              <span
                className={`text-sm ${
                  isActive || isCurrent ? "font-semibold" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <span className="text-gray-400 text-sm">→</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
