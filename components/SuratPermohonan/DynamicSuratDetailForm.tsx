import FormSktm from "./Forms/FormSKTM";
import FormPindahKeluar from "./Forms/FormPindahKeluar";

import FormDomisili from "@/components/SuratPermohonan/Forms/SuratDomisili";
import FormKelahiran from "@/components/SuratPermohonan/Forms/SuratKelahiran";
import FormKematian from "@/components/SuratPermohonan/Forms/FormKematian";
import FormAhliWaris from "@/components/SuratPermohonan/Forms/FormAhliWaris";
import FormOrangTua from "@/components/SuratPermohonan/Forms/FormOrangTua";
import FormTidakDiTempat from "@/components/SuratPermohonan/Forms/FormTidakDiTempat";
import FormBelumMenikah from "@/components/SuratPermohonan/Forms/FormBelumMenikah";
import FormNikah from "@/components/SuratPermohonan/Forms/FormNikah";
import FormUsaha from "@/components/SuratPermohonan/Forms/FormUsaha";

interface Props {
  kodeJenisSurat: string;
  kartuKeluargaId?: string;
  userId?: string;
}

export default function DynamicSuratDetailForm({
  kodeJenisSurat,
  kartuKeluargaId,
  userId,
}: Props) {
  const formMap: Record<string, JSX.Element> = {
    DOMISILI: <FormDomisili />,
    KELAHIRAN: <FormKelahiran />,
    KEMATIAN: <FormKematian kartuKeluargaId={kartuKeluargaId ?? ""} />,
    AHLI_WARIS: (
      <FormAhliWaris
        kartuKeluargaId={kartuKeluargaId ?? ""}
        userId={userId ?? ""}
      />
    ),
    SUKET_ORTU: <FormOrangTua userId={userId ?? ""} />,
    TIDAK_DI_TEMPAT: (
      <FormTidakDiTempat kartuKeluargaId={kartuKeluargaId ?? ""} />
    ),
    PINDAH_KELUAR: <FormPindahKeluar />,
    SKTM: <FormSktm kartuKeluargaId={kartuKeluargaId ?? ""} />,
    BELUM_MENIKAH: <FormBelumMenikah />,
    NIKAH: <FormNikah />,
    SUKET_USAHA: <FormUsaha />,
  };

  return formMap[kodeJenisSurat] ?? null;
}
