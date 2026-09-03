import { getPool } from "@/lib/db";
import type { Student } from "@/types";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.execute("SELECT id, nama FROM students ORDER BY nama ASC");
    const students = (rows as { id: string; nama: string }[]).map(
      (row): Student => ({ id: row.id, name: row.nama })
    );
    return Response.json(students);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
