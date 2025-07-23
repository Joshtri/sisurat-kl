"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token reset password tidak valid");
      setIsValidToken(false);

      return;
    }

    // Verify token on component mount
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `/api/auth/verify-reset-token?token=${token}`,
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Token tidak valid");
        }

        setIsValidToken(true);
      } catch (error: any) {
        console.error("Token verification error:", error);
        setError(
          error.message ||
            "Token reset password tidak valid atau sudah kedaluwarsa",
        );
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setIsLoading(false);

      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);

      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengatur ulang password");
      }

      setIsSuccess(true);
      showToast({
        title: "Berhasil",
        description: "Password berhasil diubah!",
        color: "success",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError(
        error.message || "Terjadi kesalahan saat mengatur ulang password",
      );
      showToast({
        title: "Error",
        description:
          error.message || "Terjadi kesalahan saat mengatur ulang password",
        color: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="flex flex-col items-center">
          <Spinner size="lg" color="primary" />
          <p className="text-default-600 mt-4">Memverifikasi token...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
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
                className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <ExclamationTriangleIcon className="w-8 h-8 text-danger-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground">
                Token Tidak Valid
              </h2>
              <p className="text-default-600 mt-2">
                Link reset password tidak valid atau sudah kedaluwarsa
              </p>
            </CardHeader>
            <CardBody>
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4">
                <div className="text-danger-800 text-sm">{error}</div>
              </div>

              <div className="space-y-3">
                <Button
                  as={Link}
                  href="/forgot-password"
                  color="primary"
                  className="w-full"
                  size="lg"
                >
                  Minta Link Reset Password Baru
                </Button>

                <Button
                  as={Link}
                  href="/"
                  variant="bordered"
                  className="w-full"
                  size="lg"
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

  if (isSuccess) {
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
                Password Berhasil Diubah!
              </h2>
              <p className="text-default-600 mt-2">
                Password Anda telah berhasil diperbarui
              </p>
            </CardHeader>
            <CardBody>
              <Button
                as={Link}
                href="/"
                color="primary"
                className="w-full"
                size="lg"
              >
                Login dengan Password Baru
              </Button>
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
              <LockClosedIcon className="w-8 h-8 text-primary-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground">
              Atur Password Baru
            </h2>
            <p className="text-default-600 mt-2">Masukkan password baru Anda</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <div className="text-danger-800 text-sm">{error}</div>
                </div>
              )}

              <Input
                type={showPassword ? "text" : "password"}
                label="Password Baru"
                placeholder="Masukkan password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                size="lg"
                variant="bordered"
                startContent={
                  <LockClosedIcon className="w-4 h-4 text-default-400" />
                }
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                }
                isInvalid={
                  !!error && password.length > 0 && password.length < 6
                }
                errorMessage={
                  error && password.length > 0 && password.length < 6
                    ? "Password minimal 6 karakter"
                    : ""
                }
              />

              <Input
                type={showConfirmPassword ? "text" : "password"}
                label="Konfirmasi Password"
                placeholder="Konfirmasi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                size="lg"
                variant="bordered"
                startContent={
                  <LockClosedIcon className="w-4 h-4 text-default-400" />
                }
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                }
                isInvalid={!!confirmPassword && password !== confirmPassword}
                errorMessage={
                  confirmPassword && password !== confirmPassword
                    ? "Password tidak cocok"
                    : ""
                }
              />

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                disabled={isLoading || !password || !confirmPassword}
                startContent={
                  isLoading ? <Spinner size="sm" color="white" /> : null
                }
              >
                {isLoading ? "Memperbarui Password..." : "Atur Password Baru"}
              </Button>

              <div className="text-center pt-4">
                <Link
                  href="/"
                  className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
                >
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="flex flex-col items-center">
            <Spinner size="lg" color="primary" />
            <p className="text-default-600 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
