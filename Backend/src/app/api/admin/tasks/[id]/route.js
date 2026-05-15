import { NextResponse } from 'next/server'
import { db } from '@/lib/db/db.js'
import { toDoLists } from '@/lib/db/schema.js'
import { eq, and } from 'drizzle-orm'
import { requireAdmin } from '@/lib/middleware.js'

/**
 * PATCH /api/admin/tasks/[id]
 * Update a task (toggle status or edit fields).
 *
 * Body: Partial<{ title, description, status, priority, category, when, due }>
 * Response: { task: Task }
 */
export async function PATCH(request, { params }) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid task id' }, { status: 400 })
  }

  const body = await request.json()

  // ── DUMMY RESPONSE (replace with DB update after migration) ─────────────
  // Mirror back whatever was sent so the frontend can optimistically update.
  const updatedTask = { id, userId: authResult.userId, ...body }
  // ── END DUMMY ────────────────────────────────────────────────────────────

  // ── REAL UPDATE (uncomment after schema migration) ───────────────────────
  // const { title, description, status, priority, category, when, due } = body
  // const updateValues = {}
  // if (title       !== undefined) updateValues.title       = title
  // if (description !== undefined) updateValues.description = description
  // if (status      !== undefined) updateValues.status      = status
  // // Store UI-only fields in meta JSON column
  // const metaFields = { priority, category, when, due }
  // const hasMeta = Object.values(metaFields).some((v) => v !== undefined)
  // if (hasMeta) {
  //   const existing = await db.query.toDoLists.findFirst({
  //     where: and(eq(toDoLists.id, id), eq(toDoLists.userId, authResult.userId)),
  //   })
  //   const prevMeta = JSON.parse(existing?.meta ?? '{}')
  //   updateValues.meta = JSON.stringify({ ...prevMeta, ...metaFields })
  // }
  // await db.update(toDoLists)
  //   .set(updateValues)
  //   .where(and(eq(toDoLists.id, id), eq(toDoLists.userId, authResult.userId)))
  // ── END REAL UPDATE ──────────────────────────────────────────────────────

  return NextResponse.json({ task: updatedTask })
}

/**
 * DELETE /api/admin/tasks/[id]
 * Delete a task.
 *
 * Response: { deleted: true, id: number }
 */
export async function DELETE(request, { params }) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid task id' }, { status: 400 })
  }

  // ── REAL DELETE (uncomment after schema migration) ───────────────────────
  // await db.delete(toDoLists)
  //   .where(and(eq(toDoLists.id, id), eq(toDoLists.userId, authResult.userId)))
  // ── END REAL DELETE ──────────────────────────────────────────────────────

  return NextResponse.json({ deleted: true, id })
}
