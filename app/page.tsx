"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Switch } from "@heroui/switch";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Image } from "@heroui/react";

import { login } from "@/services/authService";
import { showToast } from "@/utils/toastHelper";

// ------------------------------
// Progressive lock settings
// After 3 wrong attempts → 1 minute lock.
// Then every next wrong attempt increases to 2m → 5m → 15m (max).
// Lock is tracked per identifier (NIK/email). Resets on successful login.
// ------------------------------
const LOCK_TIERS_MS = [0, 60_000, 120_000, 300_000, 900_000]; // index 1..4 = 1m,2m,5m,15m
const MAX_LEVEL = 4; // 15 minutes

interface LockState {
  level: number; // 0 (no tier yet), 1,2,3,4
  failureCount: number; // counts 1..3 only when level===0
  lockedUntil: number; // epoch ms
}

function normalizeId(id?: string) {
  const s = (id || "").trim().toLowerCase();
  return s || "_default_";
}

function storageKey(id: string) {
  return `loginLock:${id}`;
}

function readLockState(id: string): LockState {
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return { level: 0, failureCount: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw) as LockState;
    return {
      level: parsed?.level ?? 0,
      failureCount: parsed?.failureCount ?? 0,
      lockedUntil: parsed?.lockedUntil ?? 0,
    };
  } catch {
    return { level: 0, failureCount: 0, lockedUntil: 0 };
  }
}

function writeLockState(id: string, state: LockState) {
  localStorage.setItem(storageKey(id), JSON.stringify(state));
}

function clearLockState(id: string) {
  localStorage.removeItem(storageKey(id));
}

function isCurrentlyLocked(state: LockState) {
  return Date.now() < (state.lockedUntil || 0);
}

function formatDuration(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

// Record one failed attempt and compute/return the new lock state
function recordFailure(id: string): LockState {
  const now = Date.now();
  let state = readLockState(id);

  // If still locked, keep as-is
  if (isCurrentlyLocked(state)) {
    return state;
  }

  if (state.level === 0) {
    // Still in pre-lock phase: accumulate failures to 3
    const failures = (state.failureCount || 0) + 1;
    if (failures >= 3) {
      // Hit 3 → go to level 1 and lock for 1 minute
      state = {
        level: 1,
        failureCount: 0,
        lockedUntil: now + LOCK_TIERS_MS[1],
      };
    } else {
      state = { ...state, failureCount: failures };
    }
  } else {
    // Already past first lock: every failure escalates to next level (max 15m)
    const nextLevel = Math.min(state.level + 1, MAX_LEVEL);
    state = {
      level: nextLevel,
      failureCount: 0,
      lockedUntil: now + LOCK_TIERS_MS[nextLevel],
    };
  }

  writeLockState(id, state);
  return state;
}

// Ensure that, after lock expires, we keep the level (so next failure escalates)
// but we clear the lockedUntil so the user can try again.
function clearExpiredLockButKeepLevel(id: string) {
  const s = readLockState(id);
  if (!isCurrentlyLocked(s) && s.lockedUntil) {
    const updated: LockState = {
      level: s.level,
      failureCount: s.failureCount || 0,
      lockedUntil: 0,
    };
    writeLockState(id, updated);
    return updated;
  }
  return s;
}

export default function LoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      nik: "",
      password: "",
    },
  });

  const currentId = normalizeId(watch("nik"));

  const [isLocked, setIsLocked] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [lockLevel, setLockLevel] = useState(0);
  const [prelockFailures, setPrelockFailures] = useState(0); // only meaningful when level===0

  const toggleVisibility = () => setIsVisible((v) => !v);

  // Track which identifier we just tried to log in with
  const lastAttemptIdRef = useRef<string>("");

  // Initialize/refresh lock state when identifier changes
  useEffect(() => {
    const s = clearExpiredLockButKeepLevel(currentId);
    const now = Date.now();
    const remaining = Math.max(0, (s.lockedUntil || 0) - now);
    setIsLocked(remaining > 0);
    setTimeLeftMs(remaining);
    setLockLevel(s.level || 0);
    setPrelockFailures(s.level === 0 ? s.failureCount || 0 : 0);
  }, [currentId]);

  // Countdown timer while locked
  useEffect(() => {
    if (!isLocked) return;
    const t = setInterval(() => {
      setTimeLeftMs((ms) => {
        const next = Math.max(0, ms - 1000);
        if (next <= 0) {
          setIsLocked(false);
          // After unlock, keep level but clear lockedUntil in storage
          clearExpiredLockButKeepLevel(currentId);
          clearInterval(t);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isLocked, currentId]);

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      // Successful login: reset lock state for this identifier
      const id = lastAttemptIdRef.current || currentId;
      clearLockState(id);

      localStorage.setItem("token", data.token);
      showToast({
        title: "Login Berhasil",
        description: `Selamat datang, ${data.role}!`,
        color: "success",
      });
      router.push(data.redirect);
    },
    onError: (err: any) => {
      const id = lastAttemptIdRef.current || currentId;
      const newState = recordFailure(id);
      const now = Date.now();

      if (isCurrentlyLocked(newState)) {
        const remaining = Math.max(0, newState.lockedUntil - now);
        setIsLocked(true);
        setTimeLeftMs(remaining);
        setLockLevel(newState.level);
        setPrelockFailures(0);

        const minutes = Math.round(LOCK_TIERS_MS[newState.level] / 60_000);
        showToast({
          title: "Terlalu banyak percobaan",
          description: `Akun dikunci selama ${minutes} menit. Coba lagi dalam ${formatDuration(remaining)}.`,
          color: "error",
        });
      } else {
        // Still in pre-lock phase (level 0): update remaining failures
        setPrelockFailures(newState.failureCount || 0);
        showToast({
          title: "Login Gagal",
          description:
            newState.failureCount >= 1
              ? `NIK/Email atau password salah. Percobaan: ${newState.failureCount}/3 sebelum terkunci 1 menit.`
              : `Terjadi kesalahan saat login`,
          color: "error",
        });
      }
    },
  });

  function handleSubmitLogin(data: { nik: string; password: string }) {
    const id = normalizeId(data.nik);
    // If currently locked, block immediately on client side
    const s = readLockState(id);
    if (isCurrentlyLocked(s)) {
      const remaining = Math.max(0, s.lockedUntil - Date.now());
      setIsLocked(true);
      setTimeLeftMs(remaining);
      setLockLevel(s.level);
      showToast({
        title: "Akun sedang dikunci",
        description: `Silakan coba lagi dalam ${formatDuration(remaining)}.`,
        color: "warning",
      });
      return;
    }

    lastAttemptIdRef.current = id;
    loginMutate(data);
  }

  // Disable all inputs while locked or loading
  const disableForm = isLocked || isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:50px_50px]" />
      </div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-300/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-300/10 rounded-full blur-xl animate-pulse delay-500" />

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center relative z-10">
        {/* Left Info Section */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <div className="flex items-center mb-8">
              <Image
                alt="Logo Kota Kupang"
                src="/img/kotakupanglogo.png"
                width={80}
                radius="full"
                className=" object-cover"
              />
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

        {/* Login Form Card */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl">
            <CardHeader className="flex flex-col items-center pt-8 pb-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-blue-100">
                <EnvelopeIcon className="text-white w-10 h-10" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  SI SURAT
                </h2>
                <p className="text-sm text-gray-600">Kelurahan Liliba</p>
              </div>
            </CardHeader>

            <CardBody className="px-8 pb-8">
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(handleSubmitLogin)}
              >
                <Controller
                  control={control}
                  name="nik"
                  rules={{ required: "NIK atau Email wajib diisi" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      label="NIK / Email"
                      labelPlacement="outside"
                      placeholder="Masukkan NIK atau Email Anda"
                      isInvalid={!!errors.nik}
                      errorMessage={errors.nik?.message}
                      isDisabled={disableForm}
                      classNames={{
                        label: "text-gray-700 font-semibold",
                        input: "text-gray-800 text-base",
                        inputWrapper:
                          "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 bg-gray-50/50",
                      }}
                      startContent={
                        <UserIcon className="w-5 h-5 text-gray-800 pointer-events-none flex-shrink-0" />
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Password wajib diisi" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={isVisible ? "text" : "password"}
                      label="Password"
                      labelPlacement="outside"
                      placeholder="Masukkan password"
                      isInvalid={!!errors.password}
                      errorMessage={errors.password?.message}
                      isDisabled={disableForm}
                      classNames={{
                        label: "text-gray-700 font-semibold",
                        input: "text-gray-800 text-base",
                        inputWrapper:
                          "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 bg-gray-50/50",
                      }}
                      startContent={
                        <LockClosedIcon className="w-5 h-5 text-gray-400 pointer-events-none flex-shrink-0" />
                      }
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                          disabled={disableForm}
                        >
                          {isVisible ? (
                            <EyeSlashIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
                          ) : (
                            <EyeIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                  )}
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
                    isDisabled={disableForm}
                  >
                    <span className="text-sm text-gray-600 font-medium ml-2">
                      Ingat saya
                    </span>
                  </Switch>
                  <Link
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    href="/forgot-password"
                  >
                    Lupa password?
                  </Link>
                </div>

                {/* Lock info / countdown */}
                {isLocked ? (
                  <div className="text-center text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg py-2">
                    Akun terkunci. Coba lagi dalam{" "}
                    <span className="font-bold">
                      {formatDuration(timeLeftMs)}
                    </span>
                    {lockLevel >= 1 && (
                      <span className="block text-xs text-red-500 mt-1">
                        Tier: {lockLevel} ({LOCK_TIERS_MS[lockLevel] / 60_000}{" "}
                        menit)
                      </span>
                    )}
                  </div>
                ) : lockLevel === 0 && prelockFailures > 0 ? (
                  <div className="text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-2">
                    Percobaan gagal:{" "}
                    <span className="font-semibold">{prelockFailures}/3</span> —
                    terkunci 1 menit jika mencapai 3.
                  </div>
                ) : null}

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  radius="lg"
                  size="lg"
                  type="submit"
                  isLoading={isPending}
                  isDisabled={disableForm}
                >
                  Masuk
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
