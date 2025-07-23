"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@heroui/react";

import { showToast } from "@/utils/toastHelper";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengirim email reset password",
        );
      }

      setIsEmailSent(true);
      showToast({
        title: "Email Terkirim",
        description: "Email reset password telah dikirim!",
        color: "success",
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError(
        error.message || "Terjadi kesalahan saat mengirim email reset password",
      );
      showToast({
        title: "Error",
        description:
          error.message ||
          "Terjadi kesalahan saat mengirim email reset password",
        color: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircleIcon className="w-8 h-8 text-success-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground">
                Email Terkirim!
              </h2>
              <p className="text-default-600 mt-2">
                Kami telah mengirim link reset password ke email Anda
              </p>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div className="text-primary-800 text-sm">
                    Silakan cek email <strong>{email}</strong> dan klik link
                    yang kami kirim untuk mengatur ulang password Anda.
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-default-600">
                <p>• Link reset password berlaku selama 1 jam</p>
                <p>• Jika tidak ada di inbox, cek folder spam/junk</p>
                <p>• Jika masih tidak menerima email, coba kirim ulang</p>
              </div>

              <div className="space-y-3">
                <Button
                  onPress={() => {
                    setIsEmailSent(false);
                    setEmail("");
                  }}
                  variant="bordered"
                  className="w-full"
                  size="lg"
                >
                  Kirim Ulang Email
                </Button>

                <Button
                  as={Link}
                  href="/"
                  color="primary"
                  className="w-full"
                  size="lg"
                  startContent={<ArrowLeftIcon className="w-4 h-4" />}
                >
                  Kembali ke Login
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <EnvelopeIcon className="w-8 h-8 text-primary-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground">
              Lupa Password?
            </h2>
            <p className="text-default-600 mt-2">
              Masukkan email Anda dan kami akan mengirim link untuk mengatur
              ulang password
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <div className="text-danger-800 text-sm">{error}</div>
                </div>
              )}

              <Input
                type="email"
                label="Email Address"
                placeholder="masukkan@email.anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                size="lg"
                variant="bordered"
                startContent={
                  <EnvelopeIcon className="w-4 h-4 text-default-400" />
                }
                isInvalid={!!error && !email}
                errorMessage={error && !email ? "Email diperlukan" : ""}
              />

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                disabled={isLoading || !email}
                startContent={
                  isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <PaperAirplaneIcon className="w-4 h-4" />
                  )
                }
              >
                {isLoading ? "Mengirim Email..." : "Kirim Link Reset Password"}
              </Button>

              <div className="text-center pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
