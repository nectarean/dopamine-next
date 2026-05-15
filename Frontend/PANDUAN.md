# 🚀 Panduan Setup Dopamine Next.js

---

## 📁 Struktur Folder Lengkap

Buat struktur folder persis seperti ini di komputer Anda:

```
dopamine-nextjs/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
│
└── src/
    ├── app/
    │   ├── globals.css          ← CSS global + Tailwind
    │   ├── layout.tsx           ← Root layout (Navbar + Footer)
    │   ├── page.tsx             ← Halaman utama (Home)
    │   │
    │   ├── products/
    │   │   └── page.tsx         ← Halaman semua produk
    │   │
    │   ├── faq/
    │   │   └── page.tsx         ← Halaman FAQ
    │   │
    │   ├── lokasi/
    │   │   └── page.tsx         ← Halaman lokasi toko
    │   │
    │   └── hubungi-kami/
    │       └── page.tsx         ← Halaman form kontak
    │
    └── components/
        ├── Navbar.tsx           ← Navbar + popup akun
        ├── HeroCarousel.tsx     ← Slider hero (3 slide, auto-play)
        ├── ProductCarousel.tsx  ← Carousel produk baru
        ├── BrandStrip.tsx       ← Section hitam "Feeling Good"
        ├── CategoryMarquee.tsx  ← Teks kategori berputar ke kiri
        ├── KoleksiGrid.tsx      ← Grid foto koleksi
        └── Footer.tsx           ← Footer dengan link halaman
```

---

## ⚙️ Langkah-langkah Setup

### 1. Install Node.js
Pastikan Node.js versi 18 atau lebih baru sudah terinstall.
Cek dengan: `node -v`
Download di: https://nodejs.org

---

### 2. Buat Folder Proyek
Buka terminal, lalu jalankan:

```bash
mkdir dopamine-nextjs
cd dopamine-nextjs
```

---

### 3. Buat Semua Folder
Jalankan perintah ini sekaligus:

```bash
mkdir -p src/app/products src/app/faq src/app/lokasi src/app/hubungi-kami src/components
```

---

### 4. Salin Semua File
Salin semua file kode yang telah diberikan ke path yang sesuai:

| File Kode              | Simpan Di                                    |
|------------------------|----------------------------------------------|
| package.json           | `dopamine-nextjs/package.json`               |
| next.config.js         | `dopamine-nextjs/next.config.js`             |
| tsconfig.json          | `dopamine-nextjs/tsconfig.json`              |
| tailwind.config.ts     | `dopamine-nextjs/tailwind.config.ts`         |
| postcss.config.js      | `dopamine-nextjs/postcss.config.js`          |
| globals.css            | `src/app/globals.css`                        |
| layout.tsx             | `src/app/layout.tsx`                         |
| page.tsx (Home)        | `src/app/page.tsx`                           |
| products/page.tsx      | `src/app/products/page.tsx`                  |
| faq/page.tsx           | `src/app/faq/page.tsx`                       |
| lokasi/page.tsx        | `src/app/lokasi/page.tsx`                    |
| hubungi-kami/page.tsx  | `src/app/hubungi-kami/page.tsx`              |
| Navbar.tsx             | `src/components/Navbar.tsx`                  |
| HeroCarousel.tsx       | `src/components/HeroCarousel.tsx`            |
| ProductCarousel.tsx    | `src/components/ProductCarousel.tsx`         |
| BrandStrip.tsx         | `src/components/BrandStrip.tsx`              |
| CategoryMarquee.tsx    | `src/components/CategoryMarquee.tsx`         |
| KoleksiGrid.tsx        | `src/components/KoleksiGrid.tsx`             |
| Footer.tsx             | `src/components/Footer.tsx`                  |

---

### 5. Install Dependencies
Di dalam folder `dopamine-nextjs`, jalankan:

```bash
npm install
```

Tunggu hingga selesai (bisa 1–2 menit).

---

### 6. Jalankan Project

```bash
npm run dev
```

Buka browser dan kunjungi: **http://localhost:3000**

---

## ✅ Fitur yang Sudah Dibuat

| Fitur                          | Status | Keterangan                                      |
|-------------------------------|--------|-------------------------------------------------|
| Navbar sticky                  | ✅     | Tetap di atas saat scroll                        |
| Popup Sign In / Daftar         | ✅     | Muncul saat klik ikon akun, tutup saat klik luar |
| Hero Carousel (3 slide)        | ✅     | Auto-play 4 detik, arrows + dots                 |
| Carousel Produk Baru           | ✅     | Geser kiri/kanan dengan tombol panah             |
| Link "Klik untuk lanjut"       | ✅     | Navigasi ke `/products`                          |
| Marquee kategori ke kiri       | ✅     | Baju, Celana, Topi, dll berputar terus           |
| Grid Koleksi                   | ✅     | 6 cell, klik navigasi ke produk                  |
| Footer links halaman sendiri   | ✅     | FAQ → `/faq`, Lokasi → `/lokasi`, dst            |
| Halaman FAQ accordion          | ✅     | Klik buka/tutup tiap pertanyaan                  |
| Halaman Hubungi Kami + form    | ✅     | Validasi nama & email, pesan sukses              |
| Halaman Lokasi                 | ✅     | Placeholder peta + info toko                     |
| Halaman Semua Produk           | ✅     | Filter kategori: semua / baju / celana / aksesoris|
| TypeScript                     | ✅     | Seluruh file menggunakan `.tsx`                  |
| Tailwind CSS                   | ✅     | Styling penuh dengan Tailwind                    |

---

## 🔧 Kustomisasi

### Ganti Gambar Hero
Di `src/components/HeroCarousel.tsx`, ganti emoji dengan tag `<Image>` dari Next.js:
```tsx
import Image from "next/image";
// Letakkan gambar di folder: public/images/hero-1.jpg
<Image src="/images/hero-1.jpg" alt="Hero" fill className="object-cover" />
```

### Tambah Produk
Di `src/app/products/page.tsx`, tambahkan objek baru di array `allProducts`:
```ts
{ name: "NAMA PRODUK", price: "Rp 000.000", emoji: "👕", category: "baju" },
```

### Integrasikan Google Maps
Di `src/app/lokasi/page.tsx`, ganti placeholder dengan:
```tsx
<iframe
  src="https://maps.google.com/maps?q=ALAMAT&output=embed"
  width="100%" height="192" className="rounded-xl border-0"
/>
```

---

## ❗ Troubleshooting

| Error                            | Solusi                                              |
|----------------------------------|-----------------------------------------------------|
| `command not found: npm`         | Install Node.js dari https://nodejs.org             |
| `Module not found`               | Pastikan nama file dan path persis sama             |
| Tailwind tidak muncul            | Cek `postcss.config.js` dan `tailwind.config.ts`   |
| Animasi marquee tidak jalan      | Cek `keyframes` di `tailwind.config.ts`             |
| Port 3000 sudah dipakai          | Jalankan `npm run dev -- -p 3001`                   |
