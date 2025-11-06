"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { CalendarIcon, DocumentArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface PeriodFilterProps {
  onPeriodChange: (period: string, startDate?: string, endDate?: string) => void;
  onExport: () => void;
  isLoading?: boolean;
}

const periodOptions = [
  { key: "today", label: "Hari Ini" },
  { key: "thisweek", label: "Minggu Ini" },
  { key: "lastweek", label: "Minggu Lalu" },
  { key: "week", label: "7 Hari Terakhir" },
  { key: "month", label: "30 Hari Terakhir" },
  { key: "3months", label: "3 Bulan Terakhir" },
  { key: "6months", label: "6 Bulan Terakhir" },
  { key: "year", label: "1 Tahun Terakhir" },
  { key: "all", label: "Semua Data" },
  { key: "custom", label: "Pilih Tanggal Kustom" },
];

export function PeriodFilter({ onPeriodChange, onExport, isLoading }: PeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedDates, setAppliedDates] = useState<{ start?: string; end?: string }>({});

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (value === "custom") {
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
      setAppliedDates({});
      onPeriodChange(value);
    }
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      // Validasi: tanggal akhir harus lebih besar dari tanggal mulai
      if (new Date(endDate) < new Date(startDate)) {
        alert("Tanggal akhir harus lebih besar atau sama dengan tanggal mulai");
        return;
      }
      setAppliedDates({ start: startDate, end: endDate });
      onPeriodChange("custom", startDate, endDate);
    } else {
      alert("Silakan pilih tanggal mulai dan tanggal akhir");
    }
  };

  const handleClearCustomDate = () => {
    setStartDate("");
    setEndDate("");
    setAppliedDates({});
    setShowCustomDates(false);
    setSelectedPeriod("month");
    onPeriodChange("month");
  };

  const formatDateDisplay = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardBody>
        <div className="space-y-4">
          {/* Periode Selection */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select
                label="Periode Laporan"
                placeholder="Pilih periode"
                selectedKeys={[selectedPeriod]}
                onChange={(e) => handlePeriodChange(e.target.value)}
                startContent={<CalendarIcon className="w-4 h-4" />}
              >
                {periodOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Button
              color="success"
              onPress={onExport}
              startContent={<DocumentArrowDownIcon className="w-5 h-5" />}
              isLoading={isLoading}
            >
              Export CSV
            </Button>
          </div>

          {/* Custom Date Section */}
          {showCustomDates && (
            <div className="bg-default-50 p-4 rounded-lg border border-default-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filter Tanggal Kustom</h4>
                <button
                  onClick={handleClearCustomDate}
                  className="text-default-400 hover:text-default-600 transition-colors"
                  title="Bersihkan filter tanggal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-default-700 mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {startDate && (
                    <p className="text-xs text-default-500 mt-1">
                      {formatDateDisplay(startDate)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-default-700 mb-2">
                    Tanggal Akhir
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {endDate && (
                    <p className="text-xs text-default-500 mt-1">
                      {formatDateDisplay(endDate)}
                    </p>
                  )}
                </div>
              </div>

              {/* Applied Date Info */}
              {appliedDates.start && appliedDates.end && (
                <div className="bg-primary/5 border border-primary/20 rounded p-2 text-xs text-primary">
                  Filter diterapkan: {formatDateDisplay(appliedDates.start)} - {formatDateDisplay(appliedDates.end)}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onPress={handleCustomDateApply}
                  isDisabled={!startDate || !endDate}
                >
                  Terapkan Filter
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  size="sm"
                  onPress={handleClearCustomDate}
                >
                  Bersihkan
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
