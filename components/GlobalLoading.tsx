// components/GlobalLoading.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading saat pathname berubah
    setIsLoading(true);

    // Listen for when the page is fully loaded
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Listen for document ready state changes
    const handleReadyStateChange = () => {
      if (document.readyState === "complete") {
        setIsLoading(false);
      }
    };

    // Check if already loaded
    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      // Listen for load events
      window.addEventListener("load", handleLoad);
      document.addEventListener("readystatechange", handleReadyStateChange);
    }

    // Cleanup listeners
    return () => {
      window.removeEventListener("load", handleLoad);
      document.removeEventListener("readystatechange", handleReadyStateChange);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="animate-pulse">
        <Spinner variant="gradient" className="text-primary w-40 h-40" />
      </div>
    </div>
  );
}
