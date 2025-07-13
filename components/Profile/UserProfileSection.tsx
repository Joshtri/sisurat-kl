"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import { KeyIcon, PencilIcon } from "@heroicons/react/24/solid";

import { EditUserDialog } from "./EditUserDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";

interface UserProfileSectionProps {
  user: {
    username: string;
    email?: string;
    role: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  };
}

export function UserProfileSection({ user }: UserProfileSectionProps) {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  return (
    <div className="p-4 rounded-xl border bg-white space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Profil Akun</h3>
        <Button
          onPress={() => setOpen(true)}
          className="text-sm text-blue-600 hover:underline"
          isIconOnly
          variant="ghost"
        >
          <PencilIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReadOnlyInput label="Username" value={user.username} />
        <ReadOnlyInput label="Email" value={user.email ?? "-"} />
        <ReadOnlyInput label="Role" value={user.role} />
        <ReadOnlyInput
          label="Dibuat pada"
          value={new Date(user.createdAt).toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        />
        <ReadOnlyInput
          label="Terakhir diubah"
          value={new Date(user.updatedAt).toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        />

        <div className="pt-3 sm:pt-6 flex justify-end">
          <Button
            color="danger"
            variant="solid"
            onPress={() => setOpenPassword(true)}
            endContent={<KeyIcon className="w-5 h-5" />}
          >
            Ganti Password
          </Button>
        </div>
      </div>
      <ChangePasswordDialog
        open={openPassword}
        onClose={() => setOpenPassword(false)}
        userId="user-id-simulasi"
      />
      <EditUserDialog open={open} onClose={() => setOpen(false)} user={user} />
    </div>
  );
}
