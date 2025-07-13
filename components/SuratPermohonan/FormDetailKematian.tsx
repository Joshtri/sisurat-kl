import { TextInput } from "@/components/ui/inputs/TextInput";
import { DateInput } from "@/components/ui/inputs/DateInput";
import { FileInput } from "@/components/ui/inputs/FileInput";

export function FormDetailKematian() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput name="detailKematian.namaAyah" label="Nama Ayah" />
      <TextInput name="detailKematian.namaIbu" label="Nama Ibu" />
      <DateInput
        name="detailKematian.tanggalKematian"
        label="Tanggal Kematian"
      />
      <TextInput name="detailKematian.tempatKematian" label="Tempat Kematian" />
      <TextInput name="detailKematian.sebabKematian" label="Sebab Kematian" />
      <FileInput
        name="detailKematian.fileSuratKematian"
        label="Surat Kematian (opsional)"
      />
    </div>
  );
}
