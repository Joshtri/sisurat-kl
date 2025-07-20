// app/terms/page.tsx
"use client";

import { Card, CardBody } from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <PageHeader
        title="Terms of Service"
        description="Syarat dan ketentuan penggunaan sistem ini. Harap dibaca dengan seksama."
      />

      <Card>
        <CardBody className="space-y-4 text-sm leading-relaxed">
          <p>
            Dengan mengakses dan menggunakan sistem ini, Anda setuju untuk
            mematuhi syarat dan ketentuan yang berlaku.
          </p>
          <p>
            Anda bertanggung jawab untuk menjaga kerahasiaan akun dan aktivitas
            Anda di dalam sistem. Segala bentuk penyalahgunaan atau pelanggaran
            akan dikenakan tindakan sesuai kebijakan kami.
          </p>
          <p>
            Konten atau fitur dalam sistem dapat berubah sewaktu-waktu tanpa
            pemberitahuan sebelumnya.
          </p>
          <p>
            Kami tidak bertanggung jawab atas kerugian yang timbul akibat
            penggunaan sistem di luar ketentuan yang telah ditetapkan.
          </p>
          <p>
            Dengan melanjutkan penggunaan sistem ini, Anda dianggap telah
            membaca dan menyetujui seluruh ketentuan yang berlaku.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
