"use client";

import { Spinner } from "@heroui/react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="animate-pulse">
        <Spinner
          variant="gradient"
          className="text-primary w-40 h-40" // 160px × 160px — gede banget!
        />
      </div>
    </div>
  );
}
