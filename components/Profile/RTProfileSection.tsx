"use client";

import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
// import EditRTDialog from "./EditRTDialog"; // (optional jika kamu mau buat form edit)

interface RTProfileSectionProps {
  rtProfile: {
    id: string;
    nik: string;
    rt: string;
    rw?: string;
    wilayah?: string;
  };
}

export function RTProfileSection({ rtProfile }: RTProfileSectionProps) {
  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Profil RT</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReadOnlyInput label="NIK" value={rtProfile.nik} />
        <ReadOnlyInput label="RT" value={rtProfile.rt} />
        <ReadOnlyInput label="RW" value={rtProfile.rw ?? "-"} />
        <ReadOnlyInput label="Wilayah" value={rtProfile.wilayah ?? "-"} />
      </div>
    </div>
  );
}
