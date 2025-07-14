import { TextInput } from "@/components/ui/inputs/TextInput";
import { FileInput } from "@/components/ui/inputs/FileInput"; // opsional jika ada

export function FormDetailUsaha() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput name="detailUsaha.jenisUsaha" label="Jenis Usaha" required />
      <TextInput name="detailUsaha.namaUsaha" label="Nama Usaha" required />
      <TextInput name="detailUsaha.alamatUsaha" label="Alamat Usaha" required />
      <FileInput name="detailUsaha.fotoUsaha" label="Foto Usaha (opsional)" />
    </div>
  );
}