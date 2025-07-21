// /services/userExcelService.ts
import axios from "axios";

export interface ImportResult {
  success: Array<{
    row: number;
    username: string;
    message: string;
  }>;
  errors: Array<{
    row: number;
    message: string;
  }>;
  total: number;
}

export interface ImportResponse {
  message: string;
  data: ImportResult;
}

// Export users to Excel
export async function exportUsersToExcel(): Promise<void> {
  try {
    const response = await axios.get("/api/users/export", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob", // Important for file download
    });

    // Create blob URL and trigger download
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Create temporary link and click it
    const link = document.createElement("a");

    link.href = url;
    link.download = `users-export-${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting users:", error);
    throw error;
  }
}

// Download template Excel
export async function downloadUsersTemplate(): Promise<void> {
  try {
    const response = await axios.get("/api/users/template", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob",
    });

    // Create blob URL and trigger download
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Create temporary link and click it
    const link = document.createElement("a");

    link.href = url;
    link.download = "template-import-users.xlsx";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading template:", error);
    throw error;
  }
}

// Import users from Excel
export async function importUsersFromExcel(
  file: File,
): Promise<ImportResponse> {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post("/api/users/import", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing users:", error);
    throw error;
  }
}
