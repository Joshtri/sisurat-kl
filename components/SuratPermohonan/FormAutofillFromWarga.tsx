import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { mapWargaToSuratFields } from "@/utils/mapWargaToSuratFields";
import { getMe } from "@/services/authService";

function FormAutofillFromWarga() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const methods = useFormContext();

  useEffect(() => {
    if (user?.id && user.profil) {
      const autofill = mapWargaToSuratFields(user.profil);

      Object.entries(autofill).forEach(([key, value]) => {
        methods.setValue(key as any, value, { shouldValidate: true });
      });
    }
  }, [user, methods.setValue]);

  return null; // tidak render UI
}

export default FormAutofillFromWarga;
