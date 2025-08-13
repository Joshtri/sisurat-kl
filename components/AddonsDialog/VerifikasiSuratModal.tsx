"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

type SuratLite = {
  id: string;
  jenisSurat: string;
  namaLengkap: string;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSurat: SuratLite | null;
  isVerifying?: boolean;
  formError?: string;
  /** Dipanggil dengan nomor surat final (prefix + slot + suffix, atau full bebas untuk tanpa template) */
  onSubmit: (noSurat: string) => void;
  onCancel: () => void;

  /** Opsi: batasi slot hanya angka (default: true) */
  numericOnly?: boolean;
  /** Opsi: auto-pad slot ke panjang tertentu (aktif kalau numericOnly=true). Contoh 3 → 001 (default: 3) */
  padLength?: number;
};

const currentYear = new Date().getFullYear();

const TEMPLATE_MAP: Record<string, string> = {
  "Surat Keterangan Orang Tua": `Kel. LLB. 474.1/ ... / X / ${currentYear}`,
  "Ahli Waris": `Kel. LLB. 593/.../ V / ${currentYear}`,
  "Surat Keterangan Belum Menikah": `Kel. LLB. 474.2/.../ X / ${currentYear}`,
  "Surat Keterangan Tidak Berada di Tempat": `Kel. LLB. 474/.../ SKU/ X / ${currentYear}`,
  "Surat Keterangan Untuk Menikah": `Kel. LLB. 474.2/.../ SKU/ X / ${currentYear}`,
  "Surat Keterangan Janda/Duda": `Kel. LLB. 474.21/ ... / XI / ${currentYear}`,
  "Surat Keterangan Kematian": `Kel. LLB. 474.3/ ... / X / ${currentYear}`,
  "Surat Keterangan Usaha": `Kel. LLB. 503/ ... / XII / ${currentYear}`,
  "Surat Keterangan Kelahiran": `Kel. LLB. 474.1/ ... / X / ${currentYear}`,
  "Surat Keterangan Pindah": `Kel. LLB. 474.5/ ... / XII / ${currentYear}`,
  "Surat Keterangan Domisili": `Kel. LLB. 474 / ... / XI / ${currentYear}`,
  "Surat Keterangan RT": "", // Tanpa template → input bebas
};

// Helpers — normalisasi agar tidak ada "//" ganda
function normalizePrefix(p: string) {
  // buang trailing slash + spasi, lalu tambahkan " / "
  return `${p.replace(/\s*\/\s*$/, "").trimEnd()} / `;
}
function normalizeSuffix(s: string) {
  // buang leading slash + spasi, lalu tambahkan " / " di depan
  return ` / ${s.replace(/^\s*\/\s*/, "").trimStart()}`;
}

/** Ambil prefix & suffix dari template berdasarkan "..." (dengan toleransi spasi) */
function extractParts(template: string) {
  if (!template) return { prefix: "", suffix: "", hasSlot: false };
  const m = template.match(/^(.*)\/\s*\.\.\.\s*\/(.*)$/);
  if (!m) return { prefix: "", suffix: "", hasSlot: false };

  const rawPrefix = (m[1] ?? "").trimEnd();
  const rawSuffix = (m[2] ?? "").trimStart();

  const prefix = normalizePrefix(rawPrefix);
  const suffix = normalizeSuffix(rawSuffix);

  return { prefix, suffix, hasSlot: true };
}

export function VerifikasiSuratModal({
  isOpen,
  onOpenChange,
  selectedSurat,
  isVerifying,
  formError,
  onSubmit,
  onCancel,
  numericOnly = true,
  padLength = 3,
}: Props) {
  const jenis = selectedSurat?.jenisSurat ?? "";
  const template = TEMPLATE_MAP[jenis] ?? "";

  const { prefix, suffix, hasSlot } = useMemo(
    () => extractParts(template),
    [template]
  );

  // Slot yang boleh diketik user (mengganti "...")
  const [slotValue, setSlotValue] = useState("");

  // Ref untuk autofocus slot saat modal dibuka
  const slotInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // reset saat surat berganti
    if (hasSlot) {
      setSlotValue("");
    } else {
      setSlotValue(template || "");
    }
  }, [selectedSurat, hasSlot, template]);

  useEffect(() => {
    if (isOpen && hasSlot) {
      // autofocus sedikit delay supaya setelah animasi Modal
      const t = setTimeout(() => slotInputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isOpen, hasSlot]);

  // Sanitizer untuk input slot
  const applySanitize = (raw: string) => {
    let v = raw;
    if (numericOnly) {
      v = v.replace(/\D+/g, ""); // keep digits only
    }
    return v;
  };

  // Pad hanya untuk preview & submit (nilai ketikan tetap apa adanya di slot)
  const paddedSlot = useMemo(() => {
    if (!numericOnly) return slotValue.trim();
    const s = slotValue.trim();
    if (!s) return s;
    return s.padStart(padLength, "0");
  }, [slotValue, numericOnly, padLength]);

  // Nilai noSurat final yang akan dikirim
  const fullValue = useMemo(() => {
    if (hasSlot)
      return `${prefix}${paddedSlot}${suffix}`.replace(/\s{2,}/g, " ").trim();
    return slotValue.trim(); // tanpa template → input bebas
  }, [hasSlot, prefix, paddedSlot, suffix, slotValue]);

  const canSubmit = hasSlot
    ? paddedSlot.length > 0
    : slotValue.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isVerifying) return;
    onSubmit(fullValue);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-success" />
                <span>Verifikasi Surat</span>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-600">
                    Anda akan memverifikasi surat berikut:
                  </p>
                  <div className="bg-default-100 p-3 rounded-lg mt-2">
                    <p className="font-medium">{selectedSurat?.jenisSurat}</p>
                    <p className="text-sm text-default-600">
                      Pemohon: {selectedSurat?.namaLengkap}
                    </p>
                  </div>
                </div>

                {/* FIELD NOMOR SURAT */}
                {hasSlot ? (
                  <>
                    <label className="text-sm font-medium">Nomor Surat</label>

                    {/* Desktop: segmented inline */}
                    <div
                      className={[
                        "hidden md:flex items-stretch w-full rounded-medium border border-default-200",
                        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden",
                        formError ? "border-danger" : "",
                      ].join(" ")}
                    >
                      {/* Prefix (read-only) */}
                      <div
                        className="px-3 py-2 text-default-700 bg-default-100 select-none whitespace-nowrap truncate shrink min-w-0 max-w-[45%]"
                        title={prefix}
                      >
                        {prefix}
                      </div>

                      {/* Slot editable */}
                      <input
                        ref={slotInputRef}
                        aria-label="Isi nomor pada bagian kosong"
                        className="px-3 py-2 flex-1 min-w-0 outline-none bg-transparent"
                        placeholder="isi di sini"
                        value={slotValue}
                        onChange={(e) =>
                          setSlotValue(applySanitize(e.target.value))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmit();
                          }
                        }}
                        inputMode={numericOnly ? "numeric" : "text"}
                        autoCapitalize="off"
                        autoCorrect="off"
                        autoComplete="off"
                      />

                      {/* Suffix (read-only) */}
                      <div
                        className="px-3 py-2 text-default-700 bg-default-100 select-none whitespace-nowrap truncate shrink min-w-0 max-w-[45%]"
                        title={suffix}
                      >
                        {suffix}
                      </div>
                    </div>

                    {/* Mobile: stacked agar tidak overflow */}
                    <div className="md:hidden space-y-2">
                      <div className="rounded-medium border border-default-200 bg-default-100 px-3 py-2 text-default-700">
                        <span className="text-xs text-default-500 block mb-1">
                          Prefix
                        </span>
                        <div className="whitespace-pre-wrap break-words">
                          {prefix}
                        </div>
                      </div>

                      <Input
                        aria-label="Isi nomor pada bagian kosong"
                        label="Isi nomor (bagian tengah)"
                        placeholder="isi di sini"
                        value={slotValue}
                        onValueChange={(v) => setSlotValue(applySanitize(v))}
                        variant="bordered"
                        isInvalid={!!formError}
                        onKeyDown={(e) => {
                          if ((e as React.KeyboardEvent).key === "Enter")
                            handleSubmit();
                        }}
                        inputMode={numericOnly ? "numeric" : "text"}
                      />

                      <div className="rounded-medium border border-default-200 bg-default-100 px-3 py-2 text-default-700">
                        <span className="text-xs text-default-500 block mb-1">
                          Suffix
                        </span>
                        <div className="whitespace-pre-wrap break-words">
                          {suffix}
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <Input
                      value={fullValue}
                      label="Pratinjau Nomor Surat (otomatis)"
                      variant="bordered"
                      isReadOnly
                      isInvalid={!!formError}
                      errorMessage={formError}
                      className="mt-2"
                    />
                    <p className="text-xs text-default-500">
                      Hanya bagian tengah yang bisa diketik. Contoh isian:{" "}
                      <code>001</code> →{" "}
                      <code>
                        {prefix}001{suffix}
                      </code>
                    </p>
                  </>
                ) : (
                  <Input
                    label="Nomor Surat"
                    placeholder="Masukkan nomor surat"
                    value={slotValue}
                    onValueChange={setSlotValue}
                    isInvalid={!!formError}
                    errorMessage={formError}
                    isRequired
                    variant="bordered"
                    onKeyDown={(e) => {
                      if ((e as React.KeyboardEvent).key === "Enter")
                        handleSubmit();
                    }}
                  />
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onCancel();
                  onClose();
                }}
                isDisabled={isVerifying}
              >
                Batal
              </Button>
              <Button
                color="success"
                onPress={handleSubmit}
                isLoading={isVerifying}
                startContent={
                  !isVerifying && <CheckCircleIcon className="w-4 h-4" />
                }
                isDisabled={!canSubmit || !!formError}
              >
                {isVerifying ? "Memverifikasi..." : "Verifikasi"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
