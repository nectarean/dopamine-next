"use client";

import { useState } from "react";
import Link from "next/link";

export default function HubungiKamiPage() {
  const [form, setForm] = useState({ nama: "", email: "", subjek: "", pesan: "" });
  const [sent, setSent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.email) return;
    setSent(true);
    setForm({ nama: "", email: "", subjek: "", pesan: "" });
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Back bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-[#f5f3ef]">
        <Link
          href="/"
          className="w-8 h-8 border-[1.5px] border-black rounded-full flex items-center justify-center text-sm hover:bg-black hover:text-white transition-colors"
          aria-label="Kembali"
        >←</Link>
        <h1 className="font-black tracking-widest text-sm">HUBUNGI KAMI</h1>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        <p className="text-xs text-gray-500 mb-6">Ada pertanyaan? Kami siap membantu.</p>

        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-xs text-green-700">
            ✓ Pesan berhasil terkirim! Kami akan merespons dalam 1–2 hari kerja.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-black tracking-widest block mb-1.5">NAMA</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama lengkap Anda"
              className="w-full border-[1.5px] border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-black tracking-widest block mb-1.5">EMAIL</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@contoh.com"
              className="w-full border-[1.5px] border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-black tracking-widest block mb-1.5">SUBJEK</label>
            <input
              type="text"
              name="subjek"
              value={form.subjek}
              onChange={handleChange}
              placeholder="Topik pesan Anda"
              className="w-full border-[1.5px] border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-black tracking-widest block mb-1.5">PESAN</label>
            <textarea
              name="pesan"
              value={form.pesan}
              onChange={handleChange}
              placeholder="Tulis pesan Anda di sini..."
              rows={4}
              className="w-full border-[1.5px] border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white resize-y"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-black text-[11px] tracking-widest hover:opacity-80 transition-opacity"
          >
            KIRIM PESAN →
          </button>
        </form>

        {/* Direct contact */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-[11px] font-black tracking-widest mb-4">ATAU HUBUNGI LANGSUNG</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📧 hello@dopamine.id</p>
            <p>📱 +62 812-3456-7890</p>
            <p>📸 @dopamine.id</p>
          </div>
        </div>
      </div>
    </div>
  );
}
