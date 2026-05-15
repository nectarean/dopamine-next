/**
 * tasks.ts — Frontend service layer untuk To-do & Task
 *
 * Saat ini menggunakan DUMMY DATA lokal yang strukturnya identik
 * dengan response API backend (/api/admin/tasks).
 *
 * Cara switch ke real API:
 *   1. Ganti konstanta BASE_URL sesuai URL backend kamu.
 *   2. Ubah USE_DUMMY_DATA = false
 *   3. Pastikan token JWT dikirim lewat header Authorization.
 *   Semua fungsi sudah mengembalikan Promise sehingga komponen
 *   tidak perlu diubah sama sekali.
 */

/* ─────────────────────────────────────────
   Config
───────────────────────────────────────── */
const USE_DUMMY_DATA = true
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

/* ─────────────────────────────────────────
   Types  (match to_do_lists schema)
───────────────────────────────────────── */
export type Priority = 'Tinggi' | 'Sedang' | 'Rendah'
export type Category = 'Operasional' | 'Keuangan' | 'Pengiriman' | 'Produk' | 'Lainnya'
export type When     = 'today' | 'upcoming'

export interface Task {
  id:          number
  userId:      number
  title:       string
  description: string | null
  status:      boolean         // false = belum, true = selesai
  priority:    Priority
  category:    Category
  when:        When
  due:         string | null   // "YYYY-MM-DD"
}

export type CreateTaskPayload = Omit<Task, 'id' | 'userId' | 'status'>
export type UpdateTaskPayload = Partial<Omit<Task, 'id' | 'userId'>>

/* ─────────────────────────────────────────
   Date helpers
───────────────────────────────────────── */
function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}
function offsetStr(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/* ─────────────────────────────────────────
   Dummy store  (in-memory, resets on refresh)
   Structure identik dengan response backend.
───────────────────────────────────────── */
let _nextId  = 9
const _store: Task[] = [
  { id: 1, userId: 1, title: 'Konfirmasi 10 pesanan masuk',   description: 'Cek satu per satu di panel order dan konfirmasi ke supplier.', status: false, priority: 'Tinggi', category: 'Operasional', when: 'today',    due: todayStr()    },
  { id: 2, userId: 1, title: 'Update status pengiriman',      description: null,                                                           status: false, priority: 'Sedang', category: 'Pengiriman', when: 'today',    due: todayStr()    },
  { id: 3, userId: 1, title: 'Cek ketersediaan barang',       description: 'Stok minimum kategori elektronik dan fashion.',                status: true,  priority: 'Sedang', category: 'Produk',     when: 'today',    due: todayStr()    },
  { id: 4, userId: 1, title: 'Rekap laporan mingguan',        description: 'Export CSV penjualan 7 hari terakhir.',                        status: false, priority: 'Tinggi', category: 'Keuangan',   when: 'upcoming', due: offsetStr(3)  },
  { id: 5, userId: 1, title: 'Follow-up supplier baju',       description: null,                                                           status: false, priority: 'Rendah', category: 'Operasional', when: 'upcoming', due: offsetStr(5)  },
  { id: 6, userId: 1, title: 'Audit stok gudang',             description: 'Hitung fisik stok dan cocokkan dengan sistem.',                status: false, priority: 'Sedang', category: 'Operasional', when: 'upcoming', due: offsetStr(7)  },
  { id: 7, userId: 1, title: 'Bayar invoice supplier',        description: null,                                                           status: true,  priority: 'Tinggi', category: 'Keuangan',   when: 'today',    due: todayStr()    },
  { id: 8, userId: 1, title: 'Upload foto produk baru',       description: 'Foto sudah ada di folder shared drive.',                       status: false, priority: 'Rendah', category: 'Produk',     when: 'upcoming', due: offsetStr(2)  },
]

/* ─────────────────────────────────────────
   Auth helper  (real API only)
───────────────────────────────────────── */
function authHeaders(): HeadersInit {
  // Ambil token dari sessionStorage (sesuai pola AdminLayout)
  const token =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('dopamine_token') ?? ''
      : ''
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/* ─────────────────────────────────────────
   API functions
───────────────────────────────────────── */

/** GET /api/admin/tasks */
export async function fetchTasks(): Promise<Task[]> {
  if (USE_DUMMY_DATA) {
    return Promise.resolve([..._store])
  }

  const res = await fetch(`${BASE_URL}/api/admin/tasks`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`fetchTasks failed: ${res.status}`)
  const data = await res.json()
  return data.tasks as Task[]
}

/** POST /api/admin/tasks */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  if (USE_DUMMY_DATA) {
    const task: Task = { ...payload, id: _nextId++, userId: 1, status: false }
    _store.push(task)
    return Promise.resolve({ ...task })
  }

  const res = await fetch(`${BASE_URL}/api/admin/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`createTask failed: ${res.status}`)
  const data = await res.json()
  return data.task as Task
}

/** PATCH /api/admin/tasks/:id  (toggle status atau edit) */
export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
  if (USE_DUMMY_DATA) {
    const idx = _store.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`Task ${id} not found`)
    _store[idx] = { ..._store[idx], ...payload }
    return Promise.resolve({ ..._store[idx] })
  }

  const res = await fetch(`${BASE_URL}/api/admin/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`updateTask failed: ${res.status}`)
  const data = await res.json()
  return data.task as Task
}

/** DELETE /api/admin/tasks/:id */
export async function deleteTask(id: number): Promise<void> {
  if (USE_DUMMY_DATA) {
    const idx = _store.findIndex((t) => t.id === id)
    if (idx !== -1) _store.splice(idx, 1)
    return Promise.resolve()
  }

  const res = await fetch(`${BASE_URL}/api/admin/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`deleteTask failed: ${res.status}`)
}
