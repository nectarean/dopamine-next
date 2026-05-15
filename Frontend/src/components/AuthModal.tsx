"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
}

function FormInput({
  id, label, type = "text", icon, value, onChange,
}: {
  id: string; label: string; type?: string;
  icon: React.ReactNode; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <input
        id={id} type={type} placeholder={label} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
        required
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
        {icon}
      </span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthModal({ isOpen, initialMode = "login", onClose }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMode(initialMode); }, [initialMode]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function resetForm() {
    setNama(""); setEmail(""); setSandi(""); setKonfirmasi("");
    setError(""); setSuccess("");
  }

  function switchMode(m: AuthMode) { setMode(m); resetForm(); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (mode === "login") {
        // ── Admin credentials ──
        if (email === "admin@123" && sandi === "admin123") {
          sessionStorage.setItem("dopamine_admin", "true");
          setSuccess("Selamat datang, Admin! Mengalihkan...");
          setTimeout(() => {
            onClose();
            router.push("/admin/dashboard");
          }, 1000);
          return;
        }

        // ── Regular user login ──
        if (!email || !sandi) {
          setError("Email dan sandi wajib diisi.");
          setLoading(false);
          return;
        }
        sessionStorage.setItem("dopamine_user", "true");
        setSuccess("Login berhasil! Selamat datang kembali.");
        setTimeout(() => {
          onClose();
          router.push("/profile");
        }, 1000);

      } else {
        // ── Register ──
        if (sandi !== konfirmasi) { setError("Kata sandi tidak cocok."); setLoading(false); return; }
        if (sandi.length < 6) { setError("Sandi minimal 6 karakter."); setLoading(false); return; }
        setSuccess("Akun berhasil dibuat! Silakan login.");
        setTimeout(() => switchMode("login"), 1800);
      }
      setLoading(false);
    }, 600);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] bg-white rounded-2xl shadow-2xl px-6 sm:px-8 py-8 animate-fadeInUp">
        {/* Back */}
        <button
          onClick={onClose} aria-label="Tutup"
          className="absolute left-5 top-5 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 transition-colors"
        >←</button>

        {/* Logo */}
        <div className="flex justify-center mb-5 mt-1">
          <div className="relative w-[160px] sm:w-[190px] h-[36px] sm:h-[42px]">
            <Image src="/dopamine-logo.svg" alt="DOPAMINE" fill className="object-contain" priority />
          </div>
        </div>

        <h2 className="text-xl font-black mb-5">{mode === "login" ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <FormInput id="nama" label="Nama" icon="👤" value={nama} onChange={setNama} />
          )}
          <FormInput id="email" label="Email" type="email" icon="✉️" value={email} onChange={setEmail} />
          <FormInput id="sandi" label="Sandi" type="password" icon="🔒" value={sandi} onChange={setSandi} />
          {mode === "register" && (
            <FormInput id="konfirmasi" label="Konfirmasi sandi" type="password" icon="🔒" value={konfirmasi} onChange={setKonfirmasi} />
          )}

          {mode === "register" ? (
            <p className="text-right text-[11px] text-gray-500">
              Sudah punya Akun?{" "}
              <button type="button" onClick={() => switchMode("login")} className="italic underline hover:text-black transition-colors">Login</button>
            </p>
          ) : (
            <p className="text-right text-[11px] text-gray-500">
              Lupa <button type="button" className="italic underline hover:text-black transition-colors">kata sandi</button>?
            </p>
          )}

          {error && (
            <p className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-[11px] text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 mt-1 bg-black text-white rounded-xl font-black text-sm tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? "MEMVERIFIKASI..." : "Lanjutkan"}
          </button>
        </form>

        {/* Social login */}
        <div className="mt-5 text-center">
          <p className="text-[11px] text-gray-400 mb-3">
            {mode === "register" ? "Atau masuk menggunakan" : "Masuk menggunakan"}
          </p>
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <button key={i} aria-label="Login dengan Google"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <GoogleIcon />
              </button>
            ))}
          </div>
        </div>

        {mode === "login" && (
          <p className="mt-5 text-center text-[11px] text-gray-500">
            Belum punya akun?{" "}
            <button type="button" onClick={() => switchMode("register")} className="font-bold underline hover:text-black transition-colors">
              Register sekarang
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
