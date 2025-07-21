// /services/userCompletionService.ts
import axios from "axios";

export interface UserCompletionResponse {
  isComplete: boolean;
  missingFields: string[];
  user: {
    email: string | null;
    numberWhatsApp: string | null;
  };
  profil: {
    fileKtp: string | null;
    fileKk: string | null;
  } | null;
}

export async function checkUserCompletion(): Promise<UserCompletionResponse> {
  const response = await axios.get("/api/users/check-completion", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
}

export async function completeOnboarding(formData: FormData) {
  const response = await axios.patch(
    "/api/users/complete-onboarding",
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
