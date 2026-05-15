import { NextResponse } from 'next/server'
import { db } from '@/lib/db/db.js'
import { toDoLists } from '@/lib/db/schema.js'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/middleware.js'

/**
 * GET /api/admin/tasks
 * Returns all tasks for the authenticated admin.
 *
 * Response:
 *   { tasks: Task[] }
 *
 * Task shape (matches to_do_lists schema + extra UI fields):
 *   {
 *     id:          number
 *     userId:      number
 *     title:       string
 *     description: string | null
 *     status:      boolean          // false = belum selesai, true = selesai
 *     priority:    "Tinggi" | "Sedang" | "Rendah"
 *     category:    "Operasional" | "Keuangan" | "Pengiriman" | "Produk" | "Lainnya"
 *     when:        "today" | "upcoming"
 *     due:         string | null    // "YYYY-MM-DD"
 *   }
 *
 * NOTE: priority / category / when / due are stored as JSON in a `meta`
 *       column once the schema migration is applied. For now, the route
 *       returns dummy data so the frontend can integrate immediately.
 *       Replace the DUMMY block with a real DB query after migration.
 */
export async function GET(request) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  // ── DUMMY DATA (replace with DB query after migration) ──────────────────
  const today = new Date().toISOString().split('T')[0]
  const offset = (days) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }

  const tasks = [
    {
      id: 1,
      userId: authResult.userId,
      title: 'Konfirmasi 10 pesanan masuk',
      description: 'Cek satu per satu di panel order dan konfirmasi ke supplier.',
      status: false,
      priority: 'Tinggi',
      category: 'Operasional',
      when: 'today',
      due: today,
    },
    {
      id: 2,
      userId: authResult.userId,
      title: 'Update status pengiriman',
      description: null,
      status: false,
      priority: 'Sedang',
      category: 'Pengiriman',
      when: 'today',
      due: today,
    },
    {
      id: 3,
      userId: authResult.userId,
      title: 'Cek ketersediaan barang',
      description: 'Stok minimum kategori elektronik dan fashion.',
      status: true,
      priority: 'Sedang',
      category: 'Produk',
      when: 'today',
      due: today,
    },
    {
      id: 4,
      userId: authResult.userId,
      title: 'Rekap laporan mingguan',
      description: 'Export CSV penjualan 7 hari terakhir.',
      status: false,
      priority: 'Tinggi',
      category: 'Keuangan',
      when: 'upcoming',
      due: offset(3),
    },
    {
      id: 5,
      userId: authResult.userId,
      title: 'Follow-up supplier baju',
      description: null,
      status: false,
      priority: 'Rendah',
      category: 'Operasional',
      when: 'upcoming',
      due: offset(5),
    },
    {
      id: 6,
      userId: authResult.userId,
      title: 'Audit stok gudang',
      description: 'Hitung fisik stok dan cocokkan dengan sistem.',
      status: false,
      priority: 'Sedang',
      category: 'Operasional',
      when: 'upcoming',
      due: offset(7),
    },
    {
      id: 7,
      userId: authResult.userId,
      title: 'Bayar invoice supplier',
      description: null,
      status: true,
      priority: 'Tinggi',
      category: 'Keuangan',
      when: 'today',
      due: today,
    },
    {
      id: 8,
      userId: authResult.userId,
      title: 'Upload foto produk baru',
      description: 'Foto sudah ada di folder shared drive.',
      status: false,
      priority: 'Rendah',
      category: 'Produk',
      when: 'upcoming',
      due: offset(2),
    },
  ]
  // ── END DUMMY ────────────────────────────────────────────────────────────

  // ── REAL QUERY (uncomment after schema migration) ────────────────────────
  // const rows = await db.query.toDoLists.findMany({
  //   where: eq(toDoLists.userId, authResult.userId),
  // })
  // const tasks = rows.map((r) => ({
  //   id:          r.id,
  //   userId:      r.userId,
  //   title:       r.title,
  //   description: r.description,
  //   status:      r.status,
  //   ...JSON.parse(r.meta ?? '{}'),
  // }))
  // ── END REAL QUERY ───────────────────────────────────────────────────────

  return NextResponse.json({ tasks })
}

/**
 * POST /api/admin/tasks
 * Create a new task.
 *
 * Body: { title, description?, priority, category, when, due? }
 * Response: { task: Task }
 */
export async function POST(request) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json()
  const { title, description, priority, category, when, due } = body

  if (!title || !priority || !category || !when) {
    return NextResponse.json(
      { error: 'title, priority, category, and when are required' },
      { status: 400 }
    )
  }

  // ── DUMMY RESPONSE (replace with DB insert after migration) ─────────────
  const newTask = {
    id: Date.now(),
    userId: authResult.userId,
    title,
    description: description ?? null,
    status: false,
    priority,
    category,
    when,
    due: due ?? null,
  }
  // ── END DUMMY ────────────────────────────────────────────────────────────

  // ── REAL INSERT (uncomment after schema migration) ───────────────────────
  // const result = await db.insert(toDoLists).values({
  //   userId:      authResult.userId,
  //   title,
  //   description: description ?? null,
  //   status:      false,
  //   meta:        JSON.stringify({ priority, category, when, due: due ?? null }),
  // })
  // const newTask = { id: result.insertId, userId: authResult.userId,
  //   title, description: description ?? null, status: false,
  //   priority, category, when, due: due ?? null }
  // ── END REAL INSERT ──────────────────────────────────────────────────────

  return NextResponse.json({ task: newTask }, { status: 201 })
}
