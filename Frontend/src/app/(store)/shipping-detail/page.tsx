"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ── Data provinsi Indonesia ── */
const provinsiList = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah", "DI Yogyakarta",
  "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan",
  "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo",
  "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Maluku", "Maluku Utara", "Papua Barat", "Papua",
];

const kotaByProvinsi: Record<string, string[]> = {
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur"],
  "Jawa Barat": ["Bandung", "Bogor", "Bekasi", "Depok", "Cimahi", "Cirebon", "Sukabumi"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang", "Pekalongan", "Salatiga", "Tegal"],
  "DI Yogyakarta": ["Kota Yogyakarta", "Sleman", "Bantul", "Gunungkidul", "Kulon Progo"],
  "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo", "Gresik", "Mojokerto", "Kediri", "Madiun"],
  "Bali": ["Denpasar", "Badung", "Gianyar", "Tabanan", "Buleleng", "Karangasem"],
  "Sulawesi Selatan": ["Makassar", "Gowa", "Maros", "Takalar", "Bone", "Palopo", "Pare-Pare"],
  "Sulawesi Tenggara": ["Kendari", "Baubau", "Kolaka", "Konawe", "Muna"],
  "Sumatera Utara": ["Medan", "Binjai", "Pematangsiantar", "Tebing Tinggi", "Deli Serdang"],
};

const kelurahanList = ["Kelurahan 1", "Kelurahan 2", "Kelurahan 3", "Kelurahan 4", "Kelurahan 5"];

/* ── Field input garis bawah ── */
function LineInput({
  label, value, onChange, type = "text", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        placeholder=" "
        className="w-full bg-transparent border-b border-gray-300 pb-2 pt-5 text-sm focus:outline-none focus:border-black transition-colors peer"
      />
      <label
        className={`absolute left-0 text-sm transition-all duration-200 pointer-events-none ${
          focused || value
            ? "top-0 text-xs text-gray-400"
            : "top-4 text-gray-400"
        }`}
      >
        {label}{required && " *"}
      </label>
    </div>
  );
}

/* ── Select garis bawah ── */
function LineSelect({
  label, value, onChange, options, disabled = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-transparent border-b pb-2 pt-5 text-sm focus:outline-none focus:border-black transition-colors appearance-none pr-6 ${
          disabled ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-black cursor-pointer"
        }`}
      >
        <option value="" disabled hidden />
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <label
        className={`absolute left-0 text-xs pointer-events-none transition-all duration-200 ${
          value ? "top-0 text-gray-400" : "top-4 text-sm text-gray-400"
        }`}
      >
        {label}
      </label>
      <span className="absolute right-0 bottom-3 text-gray-400 text-xs pointer-events-none">
        ˅
      </span>
    </div>
  );
}

/* ── Main Page ── */
export default function ShippingDetailPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    alamat: "",
    info: "",
    provinsi: "",
    kota: "",
    kelurahan: "",
    kodePos: "",
    noTelp: "",
  });

  const [saved, setSaved] = useState(false);

  function set(field: keyof typeof form) {
    return (v: string) => {
      setForm((f) => ({ ...f, [field]: v }));
      // Reset kota & kelurahan jika provinsi berubah
      if (field === "provinsi") {
        setForm((f) => ({ ...f, provinsi: v, kota: "", kelurahan: "" }));
      }
    };
  }

  function handleSimpan(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.email || !form.alamat || !form.provinsi || !form.kota || !form.noTelp) {
      alert("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }
    setSaved(true);
    setTimeout(() => {
      router.push("/checkout");
    }, 1000);
  }

  const kotaOptions = form.provinsi
    ? (kotaByProvinsi[form.provinsi] ?? ["Kota/Kabupaten di " + form.provinsi])
    : [];

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 sm:py-14">

        <h1 className="text-3xl sm:text-4xl font-light mb-12">Detail Pengiriman</h1>

        <form onSubmit={handleSimpan} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">

            {/* Nama penerima */}
            <LineInput
              label="Nama penerima"
              value={form.nama}
              onChange={set("nama")}
              required
            />

            {/* Email */}
            <LineInput
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              required
            />

            {/* Alamat */}
            <LineInput
              label="Alamat"
              value={form.alamat}
              onChange={set("alamat")}
              required
            />

            {/* Informasi lanjut */}
            <LineInput
              label="Informasi lanjut (Opsional)"
              value={form.info}
              onChange={set("info")}
            />

            {/* Provinsi */}
            <LineSelect
              label="Provinsi"
              value={form.provinsi}
              onChange={set("provinsi")}
              options={provinsiList}
            />

            {/* Kota/Kabupaten */}
            <LineSelect
              label="Kota/Kabupaten"
              value={form.kota}
              onChange={set("kota")}
              options={kotaOptions}
              disabled={!form.provinsi}
            />

            {/* Kelurahan */}
            <LineSelect
              label="Kelurahan"
              value={form.kelurahan}
              onChange={set("kelurahan")}
              options={kelurahanList}
              disabled={!form.kota}
            />

            {/* Kode pos */}
            <LineInput
              label="Kode pos"
              type="number"
              value={form.kodePos}
              onChange={set("kodePos")}
            />

            {/* No Telpon — full width */}
            <div className="sm:col-span-1">
              <LineInput
                label="No Telpon"
                type="tel"
                value={form.noTelp}
                onChange={set("noTelp")}
                required
              />
            </div>

          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end mt-16">
            <button
              type="submit"
              className={`w-full sm:w-[340px] py-4 font-medium text-sm tracking-wide transition-all rounded-sm ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:opacity-80"
              }`}
            >
              {saved ? "✓ Tersimpan — Mengalihkan..." : "Simpan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
