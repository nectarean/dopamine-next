"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import DopamineLogo from "./DopamineLogo";

type AuthMode = "login" | "register";

export default function Navbar() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("dopamine_user");
    setIsLoggedIn(!!user);
  }, []);

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setModalOpen(true);
  }

  function handleAccountClick() {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      openAuth("login");
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#f5f3ef] border-b border-gray-200">
        <Link href="/" aria-label="Dopamine Home">
          <DopamineLogo variant="dark" />
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <button aria-label="Cari" className="text-lg hover:opacity-60 transition-opacity">🔍</button>
          <button aria-label="Keranjang" className="text-lg hover:opacity-60 transition-opacity">🛍</button>
          <button
            aria-label="Akun"
            className="text-lg hover:opacity-60 transition-opacity"
            onClick={handleAccountClick}
          >👤</button>
        </div>
      </nav>

      <AuthModal
        isOpen={modalOpen}
        initialMode={authMode}
        onClose={() => {
          setModalOpen(false);
          // Recheck login state after modal closes
          const user = sessionStorage.getItem("dopamine_user");
          setIsLoggedIn(!!user);
        }}
      />
    </>
  );
}
