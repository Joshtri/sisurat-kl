"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Switch } from "@heroui/switch";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    nik: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.nik || !formData.password) {
      setError("NIK dan password harus diisi");

      return;
    }

    setIsLoading(true);

    // Simulasi login untuk demo tampilan
    setTimeout(() => {
      setIsLoading(false);
      // Untuk demo, tampilkan pesan sukses atau error
      console.log("Login attempt:", formData);
      setError("Demo mode: Fungsi login belum diimplementasi");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:50px_50px]" />
      </div>

      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-300/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-300/10 rounded-full blur-xl animate-pulse delay-500" />

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center relative z-10">
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <ShieldCheckIcon className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-300">SI SURAT</h2>
                <p className="text-blue-200">Kelurahan Liliba</p>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Selamat Datang
            </h1>
            <p className="text-xl mb-4 text-blue-100 font-medium">
              Sistem Informasi Administrasi Surat Kelurahan Liliba
            </p>
            <p className="text-lg text-blue-200 leading-relaxed">
              Melayani dengan profesional, cepat, dan akurat untuk kebutuhan
              administrasi surat masyarakat Kelurahan Liliba.
            </p>

            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-lg font-semibold mb-3 text-white">
                Fitur Layanan:
              </h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                  Surat Keterangan Domisili
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                  Surat Keterangan Usaha
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                  Surat Pengantar KTP
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl">
            <CardHeader className="flex flex-col items-center pt-8 pb-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-blue-100">
                <ShieldCheckIcon className="text-white w-10 h-10" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  SI SURAT
                </h2>
                <p className="text-sm text-gray-600">Kelurahan Liliba</p>
              </div>
            </CardHeader>

            <CardBody className="px-8 pb-8">
              <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                <Input
                  classNames={{
                    label: "text-gray-700 font-semibold",
                    input: "text-gray-800 text-base",
                    inputWrapper:
                      "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 bg-gray-50/50",
                  }}
                  label="NIK"
                  labelPlacement="outside"
                  placeholder="Masukkan nik anda"
                  startContent={
                    <UserIcon className="w-5 h-5 text-gray-800 pointer-events-none flex-shrink-0" />
                  }
                  type="text"
                  value={formData.nik}
                  onChange={(e) => handleInputChange("nik", e.target.value)}
                />

                <Input
                  classNames={{
                    label: "text-gray-700 font-semibold",
                    input: "text-gray-800 text-base",
                    inputWrapper:
                      "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 bg-gray-50/50",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  label="Password"
                  labelPlacement="outside"
                  placeholder="Masukkan password anda"
                  startContent={
                    <LockClosedIcon className="w-5 h-5 text-gray-400 pointer-events-none flex-shrink-0" />
                  }
                  type={isVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />

                <div className="flex items-center justify-between py-2">
                  <Switch
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-blue-600",
                    }}
                    color="primary"
                    isSelected={rememberMe}
                    size="sm"
                    onValueChange={setRememberMe}
                  >
                    <span className="text-sm text-gray-600 font-medium ml-2">
                      Ingat saya
                    </span>
                  </Switch>
                  <Link
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    href="#"
                  >
                    Lupa password?
                  </Link>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  radius="lg"
                  size="lg"
                  type="submit"
                >
                  🔑 Masuk
                </Button>

                <div className="text-center mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    © 2025 Kelurahan Liliba. Hak Cipta Dilindungi.
                  </p>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
