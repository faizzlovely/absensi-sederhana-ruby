import { getPool } from "@/lib/db";
import type { AttendanceStatus } from "@/types";

type AttendancePayload = {
  studentId: string;
  status: AttendanceStatus;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, records } = body as { date: string; records: AttendancePayload[] };

    if (!date || !Array.isArray(records)) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      for (const record of records) {
        if (record.status === null) continue;

        await conn.execute(
          `INSERT INTO attendance (student_id, status, date)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE status = VALUES(status)`,
          [record.studentId, record.status, date]
        );
      }

      await conn.commit();
      return Response.json({ success: true, savedAt: new Date().toISOString() });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
