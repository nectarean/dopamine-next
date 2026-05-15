"use client";

/**
 * Dopamine — Halaman Stok Produk (Admin)
 * Path: src/app/admin/produk/page.tsx
 *
 * Cara connect ke API nyata:
 *   Ganti semua fungsi di bagian "=== API LAYER ===" dengan
 *   fetch ke endpoint backend kamu.
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────

type Produk = {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
  gambar?: string | null;
};

type FormData = {
  nama: string;
  harga: string;
  stok: string;
  kategori: string;
};

// ─────────────────────────────────────────────────────
// === API LAYER — ganti isi fungsi ini ===
// ─────────────────────────────────────────────────────

async function fetchProduk(): Promise<Produk[]> {
  // Contoh dengan API nyata:
  // const res = await fetch("/api/produk");
  // if (!res.ok) throw new Error("Gagal fetch produk");
  // return res.json();

  // DUMMY — hapus & ganti dengan fetch asli
  return [
    { id: 1,  nama: "Lasershot Muscle Tee Semi Wash Sleeve V13", harga: 101850, stok: 50, kategori: "Jersey" },
    { id: 2,  nama: "Dopamine Essential Hoodie Black",            harga: 235000, stok: 12, kategori: "Hoodie" },
    { id: 3,  nama: "Core Jogger Pants Slate",                    harga: 179000, stok: 3,  kategori: "Celana" },
    { id: 4,  nama: "Signature Logo Cap Off White",               harga: 89500,  stok: 7,  kategori: "Topi"   },
    { id: 5,  nama: "Streetwear Oversized Tee Vintage",           harga: 145000, stok: 2,  kategori: "Kaos"   },
    { id: 6,  nama: "Lasershot Muscle Tee V14 Raw",               harga: 108000, stok: 40, kategori: "Jersey" },
    { id: 7,  nama: "Dopamine Track Jacket Navy",                 harga: 289000, stok: 18, kategori: "Jaket"  },
    { id: 8,  nama: "Basic Tee Cement Grey",                      harga: 95000,  stok: 55, kategori: "Kaos"   },
    { id: 9,  nama: "Wide Leg Cargo Black",                       harga: 215000, stok: 9,  kategori: "Celana" },
    { id: 10, nama: "Ribbed Beanie Winter Edition",               harga: 75000,  stok: 22, kategori: "Topi"   },
    { id: 11, nama: "Washed Polo Shirt Cream",                    harga: 167000, stok: 4,  kategori: "Kaos"   },
    { id: 12, nama: "Dopamine Coach Jacket OG",                   harga: 320000, stok: 6,  kategori: "Jaket"  },
  ];
}

async function createProduk(data: Omit<Produk, "id">): Promise<Produk> {
  // const res = await fetch("/api/produk", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Gagal membuat produk");
  // return res.json();
  return { id: Date.now(), ...data };
}

async function updateProduk(id: number, data: Partial<Produk>): Promise<Produk> {
  // const res = await fetch(`/api/produk/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Gagal update produk");
  // return res.json();
  return { id, nama: "", harga: 0, stok: 0, kategori: "", ...data };
}

async function deleteProduk(id: number): Promise<void> {
  // const res = await fetch(`/api/produk/${id}`, { method: "DELETE" });
  // if (!res.ok) throw new Error("Gagal hapus produk");
  console.log("delete", id);
}

// ─────────────────────────────────────────────────────
// CONSTANTS & UTILS
// ─────────────────────────────────────────────────────

const LOW = 10;
const PER_PAGE = 5;

const HARI   = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN  = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function dateStr() {
  const d = new Date();
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]}`;
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────

export default function AdminProdukPage() {
  const [produk, setProduk]         = useState<Produk[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [tab, setTab]               = useState<"semua" | "menipis">("semua");
  const [page, setPage]             = useState(1);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState<Produk | null>(null);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState<FormData>({ nama: "", harga: "", stok: "", kategori: "" });
  const [formErr, setFormErr]       = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProduk(await fetchProduk());
    } catch {
      setError("Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived ──
  const filtered   = tab === "menipis" ? produk.filter(p => p.stok <= LOW) : produk;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const stats = {
    total:    produk.length,
    kategori: new Set(produk.map(p => p.kategori)).size,
    menipis:  produk.filter(p => p.stok <= LOW).length,
  };

  // ── Modal helpers ──
  function openAdd() {
    setEditItem(null);
    setForm({ nama: "", harga: "", stok: "", kategori: "" });
    setFormErr("");
    setModalOpen(true);
  }

  function openEdit(p: Produk) {
    setEditItem(p);
    setForm({ nama: p.nama, harga: String(p.harga), stok: String(p.stok), kategori: p.kategori });
    setFormErr("");
    setModalOpen(true);
  }

  async function handleSave() {
    const nama     = form.nama.trim();
    const harga    = parseInt(form.harga) || 0;
    const stok     = parseInt(form.stok);
    const kategori = form.kategori.trim();

    if (!nama)        return setFormErr("Nama produk wajib diisi.");
    if (!harga)       return setFormErr("Harga harus lebih dari 0.");
    if (isNaN(stok) || stok < 0) return setFormErr("Stok tidak valid.");
    if (!kategori)    return setFormErr("Kategori wajib diisi.");

    try {
      setSaving(true);
      setFormErr("");
      if (editItem) {
        const updated = await updateProduk(editItem.id, { nama, harga, stok, kategori });
        setProduk(prev => prev.map(p => p.id === editItem.id ? { ...p, ...updated } : p));
      } else {
        const created = await createProduk({ nama, harga, stok, kategori, gambar: null });
        setProduk(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch {
      setFormErr("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await deleteProduk(id);
      setProduk(prev => prev.filter(p => p.id !== id));
    } catch {
      alert("Gagal menghapus produk.");
    }
  }

  // ── RENDER ──
  return (
    <div className="px-6 sm:px-8 py-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="relative w-[140px] sm:w-[160px] h-[32px] sm:h-[36px]">
          <Image src="/dopamine-logo.svg" alt="DOPAMINE" fill className="object-contain object-left" priority />
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium">{dateStr()}</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard label="Total Produk" value={stats.total} />
        <StatCard label="Kategori"     value={stats.kategori} />
        <StatCard label="Stok Menipis" value={stats.menipis} low />
      </div>

      {/* Filter tabs + add button */}
      <div className="flex items-end justify-between mb-4 gap-3">
        <div className="flex border-b border-gray-200">
          {(["semua", "menipis"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-4 py-2 text-sm -mb-px transition-colors ${
                tab === t
                  ? "font-black text-black border-b-2 border-black"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {t === "semua" ? "Semua" : "Stok Menipis"}
            </button>
          ))}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors whitespace-nowrap"
        >
          <span className="text-base leading-none">+</span>
          Tambahkan Produk
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400 tracking-widest animate-pulse">MEMUAT...</div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={load} className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg">
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#fafaf8]">
                    <th className="text-left text-xs font-black tracking-wide py-3 px-4 text-gray-700">Produk</th>
                    <th className="text-left text-xs font-black tracking-wide py-3 px-4 text-gray-700">Harga</th>
                    <th className="text-center text-xs font-black tracking-wide py-3 px-4 text-gray-700">Stok</th>
                    <th className="text-left text-xs font-black tracking-wide py-3 px-4 text-gray-700">Kategori</th>
                    <th className="text-center text-xs font-black tracking-wide py-3 px-4 text-gray-700">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center text-sm text-gray-400">
                        Tidak ada produk ditemukan.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-[#fafaf8] transition-colors ${i < pageItems.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        {/* Produk */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#f5f3ef] border border-gray-100 flex items-center justify-content-center flex-shrink-0 overflow-hidden">
                              {p.gambar ? (
                                <Image src={p.gambar} alt={p.nama} width={40} height={40} className="object-cover w-full h-full" />
                              ) : (
                                <span className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📦</span>
                              )}
                            </div>
                            <span className="text-sm font-medium leading-snug max-w-[200px]">{p.nama}</span>
                          </div>
                        </td>

                        {/* Harga */}
                        <td className="py-3.5 px-4 text-sm text-gray-700 font-mono">
                          {formatRp(p.harga)}
                        </td>

                        {/* Stok */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-sm font-black ${p.stok <= LOW ? "text-red-500" : "text-gray-800"}`}>
                            {p.stok}
                          </span>
                          {p.stok <= LOW && (
                            <span className="block text-[9px] font-bold text-red-400 tracking-wider mt-0.5">MENIPIS</span>
                          )}
                        </td>

                        {/* Kategori */}
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full tracking-wide">
                            {p.kategori}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="text-xs font-bold border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-xs font-bold border border-red-100 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filtered.length > PER_PAGE && (
              <div className="flex items-center justify-center gap-1.5 py-4 border-t border-gray-100">
                <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>←</PgBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <PgBtn key={n} active={n === safePage} onClick={() => setPage(n)}>{n}</PgBtn>
                ))}
                <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>→</PgBtn>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => !saving && setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-fadeInUp"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-black text-base mb-5">
              {editItem ? "Edit Produk" : "Tambahkan Produk"}
            </h2>

            <Field label="Nama Produk">
              <input
                className="input-base"
                value={form.nama}
                onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                placeholder="Contoh: Lasershot Muscle Tee V13"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Harga (Rp)">
                <input
                  type="number"
                  className="input-base"
                  value={form.harga}
                  onChange={e => setForm(f => ({ ...f, harga: e.target.value }))}
                  placeholder="101850"
                />
              </Field>
              <Field label="Stok">
                <input
                  type="number"
                  className="input-base"
                  value={form.stok}
                  onChange={e => setForm(f => ({ ...f, stok: e.target.value }))}
                  placeholder="50"
                />
              </Field>
            </div>

            <Field label="Kategori">
              <input
                className="input-base"
                value={form.kategori}
                onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                placeholder="Jersey, Topi, Celana, ..."
              />
            </Field>

            {formErr && (
              <p className="text-xs text-red-500 font-medium mb-3 -mt-1">{formErr}</p>
            )}

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="flex-1 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 text-sm text-white bg-black rounded-xl hover:bg-gray-800 transition-colors font-black tracking-wide disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global input style */}
      <style jsx global>{`
        .input-base {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13px;
          background: #f5f3ef;
          color: #0a0a0a;
          outline: none;
          transition: border-color .15s;
          font-family: inherit;
        }
        .input-base:focus {
          border-color: #0a0a0a;
          background: #fff;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// SUB-KOMPONEN
// ─────────────────────────────────────────────────────

function StatCard({ label, value, low }: { label: string; value: number; low?: boolean }) {
  return (
    <div className={`rounded-xl p-4 sm:p-5 ${low ? "bg-red-50" : "bg-black"}`}>
      <div className={`text-xl sm:text-2xl font-black mb-1 ${low ? "text-red-500" : "text-white"}`}>
        {value}
      </div>
      <div className={`text-[10px] sm:text-xs tracking-wide ${low ? "text-red-300" : "text-white/60"}`}>
        {label}
      </div>
    </div>
  );
}

function PgBtn({
  children, active, disabled, onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all border
        ${active
          ? "bg-black text-white border-black"
          : disabled
          ? "text-gray-300 border-gray-100 cursor-not-allowed"
          : "text-gray-500 border-gray-200 hover:bg-gray-100"
        }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-black tracking-wide text-gray-500 mb-1.5 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
