"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
} from "@heroui/react";
import { ReactNode, useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import SearchBar from "@/components/ui/SearchBar";

interface Column {
  key: string;
  label: string;
  align?: "start" | "center" | "end";
}

interface Row {
  key: string;
  [key: string]: any;
}

interface ListGridProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  columns: Column[];
  rows: Row[];
  loading?: boolean;
  empty?: ReactNode;
  onOptionsClick?: () => void;
  pageSize?: number; // Tambahkan prop untuk ukuran halaman
  showPagination?: boolean; // Tambahkan prop untuk mengontrol tampilan paginasi
}

export function ListGrid({
  title,
  description,
  breadcrumbs,
  actions,
  searchPlaceholder = "Cari...",
  onSearch,
  columns,
  rows,
  loading = false,
  empty,
  onOptionsClick,
  pageSize = 10, // Default 10 item per halaman
  showPagination = true, // Default menampilkan paginasi
}: ListGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset ke halaman pertama saat sorting
  };

  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter((row) =>
        Object.values(row).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q),
        ),
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey]?.toString().toLowerCase() ?? "";
        const valB = b[sortKey]?.toString().toLowerCase() ?? "";

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;

        return 0;
      });
    }

    return filtered;
  }, [rows, searchQuery, sortKey, sortDirection]);

  // Hitung total halaman
  const totalPages = Math.ceil(filteredRows.length / pageSize);

  // Ambil data untuk halaman saat ini
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Handler untuk perubahan halaman
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset ke halaman pertama saat pencarian atau data berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rows]);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        actions={actions}
        breadcrumbs={breadcrumbs}
        description={description}
        title={title}
        onOptionsClick={onOptionsClick}
      />

      {onSearch && (
        <SearchBar
          placeholder={searchPlaceholder}
          onSearch={(val) => {
            setSearchQuery(val);
            onSearch?.(val);
          }}
        />
      )}

      {loading ? (
        <div className="text-center text-gray-500">Memuat data...</div>
      ) : filteredRows.length === 0 ? (
        (empty ?? <div className="text-center text-gray-400">Data kosong.</div>)
      ) : (
        <>
          <Table aria-label="Tabel">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  align={column.align ?? "start"}
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortKey === column.key &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={paginatedRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {showPagination && totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                showControls
                showShadow
                classNames={{
                  wrapper: "gap-2",
                  item: "w-8 h-8 text-small",
                  cursor: "font-bold",
                }}
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
