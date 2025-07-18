"use client";

import { Spinner } from "@heroui/react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="bg-white/90 p-4">
        <Spinner size="lg" variant="gradient" className="text-blue-600" />
      </div>
    </div>
  );
}
