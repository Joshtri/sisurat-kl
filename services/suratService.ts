// services/suratService.ts
import { Surat } from "@prisma/client";

// import axios from "axios";
import axios from "@/utils/axiosWithAuth";
// export interface SuratResponse {
//   id: string;
//   namaLengkap: string;
//   nik: string;
//   jenisKelamin: string;
//   tempatTanggalLahir: string;
//   alamat?: string;
//   pekerjaan?: string;
//   jenis: {
// nama: string;
//   };
//   status: string;
//   tanggalPengajuan?: string;
// }

// ✅ Ambil semua surat untuk admin/staff
export async function getAllSurat(): Promise<any[]> {
  const res = await fetch("/api/surat", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data surat");
  }

  const json = await res.json();

  return Array.isArray(json.data) ? json.data : json;
}

// ✅ Submit surat baru
export async function createSurat(data: any): Promise<Surat> {
  const res = await axios.post("/api/surat", data);

  return res.data.data; // ambil dari response { message, data }
}

export async function getSuratHistory() {
  const res = await axios.get("/api/surat/history");

  return res.data;
}

export async function getSuratHistoryById(id: string) {
  const res = await axios.get(`/api/surat/history/${id}`);

  return res.data;
}

export async function getSuratByRT(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams();

  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);

  const res = await fetch(`/api/rt/surat?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Gagal memuat surat");
  }

  return res.json();
}

export function verifySuratByRT(id: string, data: any) {
  return axios.patch(`/api/rt/surat/${id}/verify`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export async function getNotificationByRole(role: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/notifications/${role.toLowerCase()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Gagal memuat notifikasi");

  return res.json();
}

export async function getSuratDetailByRT(id: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/rt/surat/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Gagal memuat detail surat");
  }

  return res.json();
}

export async function getSuratForStaff(): Promise<any[]> {
  const res = await fetch("/api/staff/surat", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Gagal mengambil data surat untuk staff");

  const json = await res.json();

  return Array.isArray(json.data) ? json.data : [];
}

export async function verifySuratByStaff(id: string, payload: any) {
  const res = await axios.patch(`/api/staff/surat/${id}/verify`, payload);

  return res.data;
}

export async function getSuratForLurah() {
  const res = await axios.get("/api/lurah/surat", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data.data;
}

export async function getSuratDetailByLurah(id: string) {
  const res = await axios.get(`/api/lurah/surat/${id}`);

  return res.data.data; // cocok dengan return API: { data: surat }
}

export async function getSuratDetailByStaff(id: string) {
  const res = await axios.get(`/api/staff/surat/${id}`);

  return res.data;
}

// PATCH surat oleh LURAH
export async function verifySuratByLurah(id: string, data: any) {
  const res = await axios.patch(`/api/lurah/surat/${id}/verify`, data);

  return res.data;
}
// services/suratService.js - UPDATE
export const previewSuratPdf = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`/api/surat/history/${id}/preview`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/html", // Accept HTML instead of PDF
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch preview");
  }

  // Get HTML content
  const htmlContent = await response.text();

  // Convert HTML to PDF using browser's print function
  const printWindow = window.open("", "_blank");
  printWindow?.document.write(htmlContent);
  printWindow?.document.close();

  // Auto print dialog
  setTimeout(() => {
    printWindow?.print();
  }, 1000);

  return new Blob(); // Dummy return
};

// Download PDF - SAMA PERSIS DENGAN PREVIEW
export async function downloadSuratPdf(id: string): Promise<void> {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`/api/surat/history/${id}/preview`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/html", // SAMA DENGAN PREVIEW
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Gagal mendownload PDF");
  }

  // Get HTML content - SAMA DENGAN PREVIEW
  const htmlContent = await res.text();

  // Open HTML in new tab - SAMA DENGAN PREVIEW
  const printWindow = window.open("", "_blank");
  printWindow?.document.write(htmlContent);
  printWindow?.document.close();

  // Auto print dialog - SAMA DENGAN PREVIEW
  setTimeout(() => {
    printWindow?.print();
  }, 1000);
}
// Get PDF preview as blob and open in new tab
// Preview surat pengantar - SAMA DENGAN PREVIEW PDF
export async function previewSuratPengantar(id: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`/api/surat/history/${id}/pengantar`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/html", // Accept HTML like other previews
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch surat pengantar");
  }

  // Get HTML content
  const htmlContent = await response.text();

  // Open HTML in new tab - CONSISTENT BEHAVIOR
  const printWindow = window.open("", "_blank");
  printWindow?.document.write(htmlContent);
  printWindow?.document.close();

  // Auto print dialog
  setTimeout(() => {
    printWindow?.print();
  }, 1000);
}