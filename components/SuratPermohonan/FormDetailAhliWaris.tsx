import { TextInput } from "@/components/ui/inputs/TextInput";
import { DateInput } from "@/components/ui/inputs/DateInput";
import { FileInput } from "@/components/ui/inputs/FileInput";
import { TextAreaInput } from "@/components/ui/inputs/TextAreaInput";

export function FormDetailAhliWaris() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput
        name="detailAhliWaris.namaAlmarhum"
        label="Nama Almarhum"
        required
      />
      <DateInput
        name="detailAhliWaris.tanggalMeninggal"
        label="Tanggal Meninggal"
      />
      <TextInput
        name="detailAhliWaris.alamatTerakhir"
        label="Alamat Terakhir"
        required
      />
      <TextInput
        name="detailAhliWaris.hubunganDenganAlmarhum"
        label="Hubungan dengan Almarhum"
        required
      />
      <TextAreaInput
        name="detailAhliWaris.dataAhliWaris"
        label="Data Ahli Waris (JSON)"
      />
      <TextAreaInput
        name="detailAhliWaris.dataIstri"
        label="Data Istri (JSON)"
      />
      <TextAreaInput name="detailAhliWaris.dataAnak" label="Data Anak (JSON)" />
      <TextAreaInput
        name="detailAhliWaris.dataSaksi"
        label="Data Saksi (JSON)"
      />
      <FileInput
        name="detailAhliWaris.fileAktaKematian"
        label="Akta Kematian (opsional)"
      />
      <FileInput
        name="detailAhliWaris.fileKtpAhliWaris"
        label="KTP Ahli Waris (opsional, JSON file)"
      />
      <FileInput
        name="detailAhliWaris.fileAktaLahirAhliWaris"
        label="Akta Lahir Ahli Waris (opsional, JSON file)"
      />
      <FileInput
        name="detailAhliWaris.fileKtpSaksi"
        label="KTP Saksi (opsional, JSON file)"
      />
    </div>
  );
}
