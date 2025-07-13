"use client";

import { EnvelopeIcon } from "@heroicons/react/24/solid";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <div className="bg-blue-600 p-4 rounded-full shadow-lg">
          <EnvelopeIcon className="w-10 h-10 text-white" />
        </div>
        <p className="text-gray-700 font-semibold">Memuat data...</p>
      </div>
    </div>
  );
}
