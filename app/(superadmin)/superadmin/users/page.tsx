"use client";

import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ImportResultModal from "@/components/AddonsDialog/ImportResultModal";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { ListGrid } from "@/components/ui/ListGrid";
import { Users } from "@/interfaces/users";
import {
  downloadUsersTemplate,
  exportUsersToExcel,
  ImportResult,
  importUsersFromExcel,
} from "@/services/userExcelService";
import { deleteUser, getUsers } from "@/services/userService";
import { showToast } from "@/utils/toastHelper";
import { useRef, useState } from "react";
export default function UsersPage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const { data = [], isLoading } = useQuery<Users[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const queryClient = useQueryClient();

  const columns = [
    { key: "username", label: "USERNAME" },
    { key: "email", label: "EMAIL" },
    { key: "role", label: "ROLE" },
    { key: "createdAt", label: "DIBUAT" },
    { key: "statusWarga", label: "STATUS WARGA" },
    { key: "actions", label: "", align: "end" as "end" },
  ];

  const rows = data.map((user) => ({
    key: user.id,
    username: user.username,
    email: user.email ?? "-",
    role: user.role,
    createdAt: new Date(user.createdAt).toLocaleDateString("id-ID"),
    statusWarga:
      user.role === "WARGA" ? (
        user.isWarga ? (
          <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
            Terdaftar
          </span>
        ) : (
          <Link
            href={`/superadmin/warga/create?userId=${user.id}`}
            className="text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-full text-xs font-medium"
          >
            Belum terdaftar
          </Link>
        )
      ) : null, // selain WARGA, tidak tampil status

    actions: (
      <TableActions
        onDelete={{
          title: "Hapus Pengguna",
          message: `Apakah Anda yakin ingin menghapus pengguna "${user.username}"?`,
          confirmLabel: "Hapus",
          loadingText: "Menghapus...",
          onConfirm: async () => {
            try {
              await deleteUser(user.id);

              showToast({
                title: "Berhasil",
                description: `Pengguna "${user.username}" telah dihapus.`,
                color: "success",
              });

              queryClient.invalidateQueries({ queryKey: ["users"] });
            } catch (error) {
              showToast({
                title: "Gagal",
                description: "Gagal menghapus pengguna.",
                color: "error",
              });
            }
          },
        }}
        onEdit={() => router.push(`/superadmin/users/${user.id}/edit`)}
        onView={() => router.push(`/superadmin/users/${user.id}`)}
      />
    ),
  }));

  // Handle export Excel
  const handleExportUsers = async () => {
    try {
      showToast({
        title: "Export",
        description: "Memproses export data...",
        color: "success",
      });

      await exportUsersToExcel();

      showToast({
        title: "Berhasil!",
        description: "Data pengguna berhasil diexport",
        color: "success",
      });
    } catch (error) {
      showToast({
        title: "Gagal!",
        description: "Gagal mengexport data pengguna",
        color: "error",
      });
    }
  };

  // Handle download template
  const handleDownloadTemplate = async () => {
    try {
      showToast({
        title: "Download",
        description: "Memproses download template...",
        color: "info",
      });

      await downloadUsersTemplate();

      showToast({
        title: "Berhasil!",
        description: "Template berhasil didownload",
        color: "success",
      });
    } catch (error) {
      showToast({
        title: "Gagal!",
        description: "Gagal mendownload template",
        color: "error",
      });
    }
  };

  // Handle import Excel
  const handleImportUsers = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      showToast({
        title: "File Tidak Valid",
        description: "Pilih file Excel dengan format .xlsx atau .xls",
        color: "error",
      });
      return;
    }

    try {
      showToast({
        title: "Import",
        description: "Memproses import data...",
        color: "success",
      });

      const result = await importUsersFromExcel(file);
      setImportResult(result.data);
      setShowImportModal(true);

      // Refresh data jika ada yang berhasil
      if (result.data.success.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }

      showToast({
        title: "Import Selesai",
        description: `${result.data.success.length} berhasil, ${result.data.errors.length} gagal`,
        color: result.data.errors.length === 0 ? "success" : "warning",
      });
    } catch (error: any) {
      showToast({
        title: "Gagal Import",
        description:
          error.response?.data?.message || "Terjadi kesalahan saat import",
        color: "error",
      });
    }

    // Reset file input
    event.target.value = "";
  };

  // Options menu items
  const optionsMenu = [
    {
      key: "export",
      label: "Export Data",
      icon: <ArrowDownTrayIcon className="w-4 h-4" />,
      color: "success" as const,
      onPress: handleExportUsers, // Update handler
    },
    {
      key: "import",
      label: "Import Data",
      icon: <ArrowUpTrayIcon className="w-4 h-4" />,
      color: "primary" as const,
      onPress: handleImportUsers, // Update handler
    },
    {
      key: "template",
      label: "Download Template",
      icon: <DocumentArrowDownIcon className="w-4 h-4" />,
      color: "default" as const,
      onPress: handleDownloadTemplate, // Update handler
    },
  ];

  return (
    <>
      <ListGrid
        actions={
          <Button
            color="primary"
            onPress={() => router.push("/superadmin/users/create")}
          >
            Tambah Pengguna
          </Button>
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Pengguna" },
        ]}
        showPagination
        columns={columns}
        description="Daftar pengguna yang terdaftar di sistem Kelurahan."
        empty={
          <EmptyState
            action={() => router.push("/superadmin/users/create")}
            actionLabel="Tambah Pengguna"
            description="Tambahkan pengguna baru untuk mulai menggunakan sistem."
            icon={<UserIcon className="w-6 h-6" />}
            title="Belum ada pengguna"
          />
        }
        loading={isLoading}
        rows={rows}
        title="Manajemen Pengguna"
        optionsMenu={optionsMenu}
        onSearch={(val) => console.log("Search:", val)}
      />
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        style={{ display: "none" }}
      />

      {/* Import Result Modal */}
      <ImportResultModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        result={importResult}
      />
    </>
  );
}
