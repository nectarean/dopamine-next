"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
  type Task,
  type Priority,
  type Category,
  type When,
  type CreateTaskPayload,
} from "@/lib/api/tasks";

/* ─────────────────────────────────────────
   Date helpers
───────────────────────────────────────── */
function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}
function isOverdue(due: string | null, status: boolean): boolean {
  if (!due || status) return false;
  return new Date(due) < new Date(new Date().toDateString());
}
function formatDue(due: string | null): string {
  if (!due) return "";
  return new Date(due).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/* ─────────────────────────────────────────
   Priority badge styles
───────────────────────────────────────── */
const PRIORITY_STYLES: Record<Priority, string> = {
  Tinggi: "bg-red-50 text-red-600",
  Sedang: "bg-yellow-50 text-yellow-700",
  Rendah: "bg-green-50 text-green-700",
};

/* ─────────────────────────────────────────
   Empty column placeholder
───────────────────────────────────────── */
function EmptyCol({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
      <div className="text-2xl mb-2 opacity-30">○</div>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Task Card
   Menggunakan field schema: status (boolean), description (string|null)
───────────────────────────────────────── */
function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const overdue = isOverdue(task.due, task.status);

  return (
    <div
      className={`group relative bg-white border border-gray-200 rounded-xl p-4 mb-2.5 hover:border-black transition-all duration-150 hover:-translate-y-px ${
        task.status ? "opacity-60" : ""
      }`}
    >
      {/* Delete button — visible on hover */}
      <button
        onClick={() => onDelete(task.id)}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-gray-300"
        aria-label="Hapus task"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M1.5 3h10M4.5 3V2a1 1 0 011-1h2a1 1 0 011 1v1M5.5 6v4M7.5 6v4M2.5 3l.75 7.5A1 1 0 004.25 11.5h4.5a1 1 0 00.99-.86L10.5 3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Top row: checkbox + title */}
      <div className="flex items-start gap-3 mb-2.5">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
            task.status
              ? "bg-black border-black"
              : "border-gray-300 hover:border-black"
          }`}
          style={{ width: "18px", height: "18px" }}
          aria-label={task.status ? "Tandai belum selesai" : "Tandai selesai"}
        >
          {task.status && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <p
          className={`text-sm font-semibold leading-snug flex-1 pr-6 ${
            task.status ? "line-through text-gray-400" : "text-black"
          }`}
        >
          {task.title}
        </p>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 leading-relaxed mb-2.5 pl-[27px]">
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap pl-[27px]">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-[11px] text-gray-400 bg-[#f5f3ef] px-2 py-0.5 rounded-md">
          {task.category}
        </span>
        {task.due && (
          <span
            className={`text-[11px] ml-auto flex items-center gap-1 ${
              overdue ? "text-red-500 font-semibold" : "text-gray-400"
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="2" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
              <path d="M3.5 1v2M7.5 1v2M1 5h9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            {formatDue(task.due)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Add Task Modal
───────────────────────────────────────── */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateTaskPayload) => void;
}

function AddTaskModal({ open, onClose, onSave }: ModalProps) {
  const [title, setTitle]       = useState("");
  const [description, setDesc]  = useState("");
  const [priority, setPriority] = useState<Priority>("Sedang");
  const [category, setCategory] = useState<Category>("Operasional");
  const [when, setWhen]         = useState<When>("today");
  const [due, setDue]           = useState(getTodayStr());
  const [error, setError]       = useState(false);

  function handleSave() {
    if (!title.trim()) { setError(true); return; }
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      category,
      when,
      due: due || null,
    });
    setTitle(""); setDesc(""); setPriority("Sedang");
    setCategory("Operasional"); setWhen("today");
    setDue(getTodayStr()); setError(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-[480px] max-h-[90vh] overflow-y-auto p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-xl tracking-tight">Task Baru</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
            aria-label="Tutup modal"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Judul */}
        <div className="mb-4">
          <label className="block text-[10px] font-black tracking-[2px] uppercase text-gray-400 mb-1.5">
            Judul Task *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(false); }}
            placeholder="Contoh: Konfirmasi pesanan masuk"
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-colors ${
              error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-black"
            }`}
          />
          {error && <p className="text-[11px] text-red-500 mt-1">Judul tidak boleh kosong.</p>}
        </div>

        {/* Deskripsi */}
        <div className="mb-4">
          <label className="block text-[10px] font-black tracking-[2px] uppercase text-gray-400 mb-1.5">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Detail tambahan (opsional)"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>

        {/* Prioritas + Jatuh Tempo */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-black tracking-[2px] uppercase text-gray-400 mb-1.5">
              Prioritas
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="Tinggi">🔴 Tinggi</option>
              <option value="Sedang">🟡 Sedang</option>
              <option value="Rendah">🟢 Rendah</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black tracking-[2px] uppercase text-gray-400 mb-1.5">
              Jatuh Tempo
            </label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Kategori + Waktu */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-black tracking-[2px] uppercase text-gray-400 mb-1.5">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="Operasional">Operasional</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Pengiriman">Pengiriman</option>
              <option value="Produk">Produk</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black tracking-[2px] uppercase text-gray-400 mb-1.5">
              Waktu
            </label>
            <select
              value={when}
              onChange={(e) => setWhen(e.target.value as When)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="today">Hari Ini</option>
              <option value="upcoming">Mendatang</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-black text-white font-black text-sm tracking-widest uppercase py-3 rounded-xl hover:opacity-85 transition-opacity"
        >
          Simpan Task
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function AdminTodoPage() {
  const [tasks, setTasks]                   = useState<Task[]>([]);
  const [loading, setLoading]               = useState(true);
  const [modalOpen, setModalOpen]           = useState(false);
  const [filterStatus, setFilterStatus]     = useState<"all" | "todo" | "done">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");

  /* Date string */
  const today  = new Date();
  const days   = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

  /* Load tasks from service layer */
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error("Gagal memuat tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  /* Toggle status (selesai / belum) */
  async function handleToggle(id: number) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: !t.status } : t))
    );
    try {
      await updateTask(id, { status: !task.status });
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: task.status } : t))
      );
    }
  }

  /* Delete */
  async function handleDelete(id: number) {
    const prev = [...tasks];
    setTasks((t) => t.filter((x) => x.id !== id));
    try {
      await apiDeleteTask(id);
    } catch {
      setTasks(prev);
    }
  }

  /* Create */
  async function handleCreate(payload: CreateTaskPayload) {
    try {
      const newTask = await createTask(payload);
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error("Gagal membuat task:", err);
    }
  }

  /* Filtered tasks */
  const filtered = tasks.filter((t) => {
    if (filterStatus === "todo" && t.status) return false;
    if (filterStatus === "done" && !t.status) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  const colToday    = filtered.filter((t) => t.when === "today"    && !t.status);
  const colUpcoming = filtered.filter((t) => t.when === "upcoming" && !t.status);
  const colDone     = filtered.filter((t) => t.status);

  /* Stats — always from unfiltered */
  const statTotal   = tasks.length;
  const statToday   = tasks.filter((t) => t.when === "today" && !t.status).length;
  const statDone    = tasks.filter((t) => t.status).length;
  const statOverdue = tasks.filter((t) => isOverdue(t.due, t.status)).length;

  const statsData = [
    { value: String(statTotal),   label: "Total Task" },
    { value: String(statToday),   label: "Hari Ini" },
    { value: String(statDone),    label: "Selesai" },
    { value: String(statOverdue), label: "Jatuh Tempo" },
  ];

  /* Filter chips */
  function StatusChip({ val, label }: { val: "all" | "todo" | "done"; label: string }) {
    const active = filterStatus === val;
    return (
      <button
        onClick={() => setFilterStatus(val)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
          active ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
        }`}
      >
        {label}
      </button>
    );
  }
  function PriorityChip({ val, label, activeClass }: { val: "all" | Priority; label: string; activeClass: string }) {
    const active = filterPriority === val;
    return (
      <button
        onClick={() => setFilterPriority(val)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
          active ? activeClass : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <>
      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleCreate} />

      <div className="px-6 sm:px-8 py-6 max-w-5xl">
        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="font-black text-2xl tracking-tight">To-do & Task</h1>
            <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl hover:opacity-85 transition-opacity"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Tambah Task
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-7">
          {statsData.map((s, i) => (
            <div
              key={s.label}
              className={`rounded-xl p-4 sm:p-5 ${i === 0 ? "bg-black text-white" : "bg-white border border-gray-200"}`}
            >
              <div className={`text-xl sm:text-2xl font-black mb-1 ${i === 0 ? "text-white" : "text-black"}`}>
                {loading ? "—" : s.value}
              </div>
              <div className={`text-[10px] sm:text-xs tracking-wide ${i === 0 ? "opacity-60" : "text-gray-400"}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center flex-wrap gap-2 mb-6">
          <span className="text-[10px] font-black tracking-[2px] uppercase text-gray-400 mr-1">Status:</span>
          <StatusChip val="all"  label="Semua"  />
          <StatusChip val="todo" label="Belum"  />
          <StatusChip val="done" label="Selesai" />
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <span className="text-[10px] font-black tracking-[2px] uppercase text-gray-400 mr-1">Prioritas:</span>
          <PriorityChip val="all"    label="Semua"  activeClass="bg-black text-white border-black" />
          <PriorityChip val="Tinggi" label="Tinggi" activeClass="bg-red-50 text-red-600 border-red-300" />
          <PriorityChip val="Sedang" label="Sedang" activeClass="bg-yellow-50 text-yellow-700 border-yellow-300" />
          <PriorityChip val="Rendah" label="Rendah" activeClass="bg-green-50 text-green-700 border-green-300" />
        </div>

        {/* ── Loading state ── */}
        {loading ? (
          <div className="grid grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2.5">
                {[1, 2].map((j) => (
                  <div key={j} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
                    <div className="h-3 bg-gray-100 rounded w-3/4 mb-3" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* ── Columns ── */
          <div className="grid grid-cols-3 gap-5">
            {/* Hari Ini */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-sm tracking-wide uppercase">Hari Ini</h2>
                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                  {colToday.length}
                </span>
              </div>
              {colToday.length === 0
                ? <EmptyCol label="Tidak ada task hari ini" />
                : colToday.map((t) => (
                    <TaskCard key={t.id} task={t} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
            </div>

            {/* Mendatang */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-sm tracking-wide uppercase">Mendatang</h2>
                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                  {colUpcoming.length}
                </span>
              </div>
              {colUpcoming.length === 0
                ? <EmptyCol label="Tidak ada task mendatang" />
                : colUpcoming.map((t) => (
                    <TaskCard key={t.id} task={t} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
            </div>

            {/* Selesai */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-sm tracking-wide uppercase">Selesai</h2>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                  {colDone.length}
                </span>
              </div>
              {colDone.length === 0
                ? <EmptyCol label="Belum ada task selesai" />
                : colDone.map((t) => (
                    <TaskCard key={t.id} task={t} onToggle={handleToggle} onDelete={handleDelete} />
                  ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
