import { TextInput } from "@/components/ui/inputs/TextInput";
import { DateInput } from "@/components/ui/inputs/DateInput";
import { FileInput } from "@/components/ui/inputs/FileInput";

// FormDetailKematian.tsx
export function FormDetailKematian() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput name="detailKematian.namaAyah" label="Nama Ayah" required />
      <TextInput name="detailKematian.namaIbu" label="Nama Ibu" required />
      <DateInput
        name="detailKematian.tanggalKematian"
        label="Tanggal Kematian"
      />
      <TextInput
        name="detailKematian.tempatKematian"
        label="Tempat Kematian"
        required
      />
      <TextInput
        name="detailKematian.sebabKematian"
        label="Sebab Kematian"
        required
      />
      <FileInput
        name="detailKematian.fileSuratKematian"
        label="Surat Kematian (opsional)"
      />
    </div>
  );
}
