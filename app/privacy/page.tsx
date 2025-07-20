// app/privacy/page.tsx
"use client";

import { Card, CardBody } from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <PageHeader
        title="Privacy Policy"
        description="Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda."
      />

      <Card>
        <CardBody className="space-y-4 text-sm leading-relaxed">
          <p>
            Kami menghargai privasi Anda. Dengan menggunakan sistem ini, Anda
            menyetujui pengumpulan dan penggunaan informasi sesuai dengan
            kebijakan ini.
          </p>
          <p>
            Informasi yang dikumpulkan meliputi nama pengguna, email, dan
            aktivitas dalam sistem. Informasi ini digunakan untuk meningkatkan
            layanan, memberikan notifikasi penting, dan mengamankan akun Anda.
          </p>
          <p>
            Kami tidak akan membagikan informasi pribadi Anda kepada pihak
            ketiga tanpa persetujuan, kecuali jika diwajibkan oleh hukum.
          </p>
          <p>
            Kami menggunakan langkah-langkah keamanan teknis dan organisasi
            untuk melindungi data pribadi Anda dari akses yang tidak sah atau
            penyalahgunaan.
          </p>
          <p>
            Kebijakan ini dapat diperbarui dari waktu ke waktu. Anda akan diberi
            tahu tentang perubahan signifikan melalui sistem.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
