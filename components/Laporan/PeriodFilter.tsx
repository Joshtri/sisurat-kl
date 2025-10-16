"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { CalendarIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
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
  { key: "custom", label: "Kustom" },
];

export function PeriodFilter({ onPeriodChange, onExport, isLoading }: PeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (value === "custom") {
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
      onPeriodChange(value);
    }
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      onPeriodChange("custom", startDate, endDate);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col md:flex-row gap-4 items-end">
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

          {showCustomDates && (
            <>
              <div className="flex-1">
                <label className="text-sm text-default-600 mb-1 block">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-default-600 mb-1 block">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <Button
                color="primary"
                onPress={handleCustomDateApply}
                isDisabled={!startDate || !endDate}
              >
                Terapkan
              </Button>
            </>
          )}

          <Button
            color="success"
            onPress={onExport}
            startContent={<DocumentArrowDownIcon className="w-5 h-5" />}
            isLoading={isLoading}
          >
            Export CSV
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
