"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  WrenchScrewdriverIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Button } from "@heroui/button";

import { showToast } from "@/utils/toastHelper";

export default function MaintenancePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check maintenance status on mount
    fetch("/api/maintenance")
      .then((res) => res.json())
      .then((data) => {
        if (!data.isMaintenance) {
          router.replace("/"); // Redirect to dashboard
        }
      });
  }, [router]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/maintenance");
      const data = await res.json();

      showToast({
        title: "Maintenance Status",
        description: data.isMaintenance
          ? "SISURAT is currently under maintenance."
          : "SISURAT is operational.",
        color: data.isMaintenance ? "warning" : "success",
      });
      if (!data.isMaintenance) {
        router.replace("/");
      }
    } catch (err) {
      console.error("Error checking maintenance status:", err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-orange-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto p-10 sm:p-10"
      >
        <Card className="shadow-xl border border-gray-100 bg-white/90 backdrop-blur-sm px-6 py-8">
          <CardHeader className="flex justify-center items-center">
            <div className="relative">
              <motion.div
                className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <WrenchScrewdriverIcon className="w-10 h-10 text-orange-600" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              </motion.div>
            </div>
          </CardHeader>
          <CardBody className="text-center space-y-6">
            <div>
              <motion.h1
                className="text-3xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                SISURAT Kelurahan Liliba Sedang Ditingkatkan
              </motion.h1>
              <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full" />
            </div>

            <motion.p
              className="text-gray-600 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Kami sedang bekerja keras untuk menyempurnakan sistem SISURAT demi
              pelayanan administrasi surat yang lebih cepat dan mudah untuk
              warga Kelurahan Liliba.
            </motion.p>

            <Card className="bg-white/50 border border-gray-100">
              <CardBody>
                <div className="flex items-center justify-center space-x-3 text-gray-500">
                  <ClockIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Estimasi selesai: 30-60 menit
                  </span>
                </div>
              </CardBody>
            </Card>

            <motion.div
              className="text-sm text-gray-500 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p>
                Pemeliharaan ini akan membuat layanan SISURAT lebih andal,
                memastikan kebutuhan administrasi Anda terpenuhi dengan lebih
                baik.
              </p>
              <p>
                Terima kasih atas pengertian dan dukungan warga Liliba! Kami
                akan kembali secepatnya.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                color="primary"
                size="lg"
                variant="flat"
                className="mt-6 hover:bg-blue-100 transition-all duration-300"
                isLoading={isChecking}
                onClick={handleCheckStatus}
              >
                Cek Status Sekarang
              </Button>
            </motion.div>

            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-orange-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
