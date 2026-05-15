"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/* ── Data ── */
const statsData = [
  { value: "20", label: "Orderan Masuk" },
  { value: "Rp 90Jt", label: "Total Pendapatan" },
  { value: "3", label: "Stok Menipis" },
];

const weeklyData = {
  labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  thisWeek: [12, 19, 22, 25, 28, 32, 38],
  lastWeek: [8, 9, 10, 9, 10, 10, 9],
};

const orders = [
  { id: "01", nama: "Cwang", total: "Rp 100.000", status: "Selesai" },
  { id: "02", nama: "Cwang", total: "Rp 100.000", status: "Selesai" },
  { id: "03", nama: "Cwang", total: "Rp 100.000", status: "Selesai" },
  { id: "04", nama: "Budi", total: "Rp 229.000", status: "Diproses" },
  { id: "05", nama: "Sari", total: "Rp 189.000", status: "Pending" },
];

const lowStocks = [
  { produk: "Lasershot Muscle Tee Black V13", S: 1, M: 1, L: 1, XL: 1 },
  { produk: "Run Shorts Navy", S: 0, M: 2, L: 0, XL: 0 },
  { produk: "Sport Cap Black", S: "-", M: "-", L: 3, XL: "-" },
];

const statusStyle: Record<string, string> = {
  Selesai: "bg-green-100 text-green-700",
  Diproses: "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-600",
};

/* ── Bar Chart (canvas, no lib) ── */
function WeeklyChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const padL = 10, padR = 10, padT = 16, padB = 36;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const maxVal = Math.max(...weeklyData.thisWeek, ...weeklyData.lastWeek) * 1.15;
    const days = weeklyData.labels.length;
    const groupW = chartW / days;
    const barW = groupW * 0.28;
    const gap = groupW * 0.06;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "#e8e5e0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
    }

    weeklyData.labels.forEach((day, i) => {
      const groupX = padL + groupW * i + groupW / 2;

      // Last week bar (dark)
      const lastH = (weeklyData.lastWeek[i] / maxVal) * chartH;
      const lastX = groupX - barW - gap / 2;
      ctx.fillStyle = "#4a4740";
      ctx.beginPath();
      ctx.roundRect(lastX, padT + chartH - lastH, barW, lastH, [3, 3, 0, 0]);
      ctx.fill();

      // This week bar (cream)
      const thisH = (weeklyData.thisWeek[i] / maxVal) * chartH;
      const thisX = groupX + gap / 2;
      ctx.fillStyle = "#c8c0a8";
      ctx.beginPath();
      ctx.roundRect(thisX, padT + chartH - thisH, barW, thisH, [3, 3, 0, 0]);
      ctx.fill();

      // Day label
      ctx.fillStyle = "#888";
      ctx.font = "11px Helvetica Neue, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(day, groupX, H - 8);
    });
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
}

/* ── Main Page ── */
export default function AdminDashboardPage() {
  // Date
  const today = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

  return (
    <div className="px-6 sm:px-8 py-6 max-w-4xl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="relative w-[140px] sm:w-[160px] h-[32px] sm:h-[36px]">
          <Image src="/dopamine-logo.svg" alt="DOPAMINE" fill className="object-contain object-left" priority />
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium">{dateStr}</span>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {statsData.map((s) => (
          <div key={s.label} className="bg-black text-white rounded-xl p-4 sm:p-5">
            <div className="text-xl sm:text-2xl font-black mb-1">{s.value}</div>
            <div className="text-[10px] sm:text-xs opacity-70 tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Weekly Chart ── */}
      <div className="border border-gray-200 rounded-xl p-5 sm:p-6 mb-6 bg-white">
        <h2 className="font-black text-base sm:text-lg mb-4">Pendapatan Mingguan</h2>

        {/* Legend */}
        <div className="flex gap-5 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#c8c0a8]" />
            <span className="text-xs text-gray-600">Minggu ini</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#4a4740]" />
            <span className="text-xs text-gray-600">Minggu lalu</span>
          </div>
        </div>

        <div className="h-[220px] sm:h-[260px]">
          <WeeklyChart />
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* ── Orders Table ── */}
      <div className="mb-8">
        <h2 className="font-black text-base sm:text-lg mb-4">Orderan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-gray-200">
                {["Id", "Nama", "Total", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-black tracking-wide pb-3 text-gray-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 text-sm text-gray-500">{o.id}</td>
                  <td className="py-3.5 text-sm font-medium">{o.nama}</td>
                  <td className="py-3.5 text-sm">{o.total}</td>
                  <td className="py-3.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyle[o.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* ── Low Stock Table ── */}
      <div className="pb-10">
        <h2 className="font-black text-base sm:text-lg mb-4">Stok Krisis</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-black tracking-wide pb-3 text-gray-800 w-1/2">Produk</th>
                {["S", "M", "L", "XL", "Total"].map((h) => (
                  <th key={h} className="text-center text-xs font-black tracking-wide pb-3 text-gray-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lowStocks.map((item) => {
                const nums = [item.S, item.M, item.L, item.XL];
                const total = nums.reduce<number>((acc, v) => acc + (typeof v === "number" ? v : 0), 0);
                return (
                  <tr key={item.produk} className="border-b border-gray-100">
                    <td className="py-3.5 text-sm">{item.produk}</td>
                    {nums.map((v, i) => (
                      <td key={i} className="py-3.5 text-sm text-center">
                        <span
                          className={
                            v === 0
                              ? "text-red-500 font-bold"
                              : typeof v === "number" && v <= 1
                              ? "text-yellow-600 font-bold"
                              : "text-gray-600"
                          }
                        >
                          {v}
                        </span>
                      </td>
                    ))}
                    <td className="py-3.5 text-sm text-center font-bold">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
