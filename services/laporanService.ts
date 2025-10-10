import axios from "axios";

export interface LaporanData {
  period: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalSurat: number;
    diterbitkan: number;
    ditolak: number;
    menunggu: number;
  };
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  jenisBreakdown: Array<{
    jenis: string;
    kode: string;
    count: number;
  }>;
  rtBreakdown: Array<{
    rt: string;
    rtNumber: string;
    count: number;
  }>;
  trending: Array<{
    jenis: string;
    kode: string;
    count: number;
  }>;
  recentSurat: Array<{
    id: string;
    jenis: string;
    pemohon: string;
    status: string;
    tanggal: Date;
    noSurat: string;
  }>;
  trendPerBulan: Array<{
    month: string;
    count: number;
  }>;
}

export async function getLaporanData(
  period: string = "month",
  startDate?: string,
  endDate?: string
): Promise<LaporanData> {
  const params = new URLSearchParams({ period });
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const res = await axios.get(`/api/superadmin/laporan?${params.toString()}`);
  return res.data;
}

export async function exportLaporan(
  period: string = "month",
  startDate?: string,
  endDate?: string,
  format: string = "csv"
) {
  const params = new URLSearchParams({ period, format });
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const res = await axios.get(`/api/superadmin/laporan/export?${params.toString()}`, {
    responseType: "blob",
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `laporan-surat-${period}-${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
