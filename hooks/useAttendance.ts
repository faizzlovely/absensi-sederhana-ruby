import { useCallback, useEffect, useMemo, useState } from "react";
import type { AttendanceRecord, AttendanceStatus, Student } from "@/types";

export type SaveResult =
  | { success: true; savedAt: string }
  | { success: false; message: string; missingCount: number };

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data: Student[]) => {
        setStudents(data);
        setRecords(data.map((s) => ({ studentId: s.id, status: null })));
      })
      .catch(() => {
        setStudents([]);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const setStatus = useCallback((studentId: string, status: AttendanceStatus) => {
    setRecords((current) =>
      current.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  }, []);

  const summary = useMemo(() => {
    let hadir = 0;
    let tidakHadir = 0;

    for (const record of records) {
      if (record.status === "hadir") hadir += 1;
      else if (record.status === "tidak_hadir") tidakHadir += 1;
    }

    return {
      hadir,
      tidakHadir,
      belumDiabsen: records.length - hadir - tidakHadir,
    };
  }, [records]);

  const save = useCallback(async (): Promise<SaveResult> => {
    const missingCount = summary.belumDiabsen;

    if (missingCount > 0) {
      return {
        success: false,
        message: `Masih ada ${missingCount} siswa yang belum diabsen.`,
        missingCount,
      };
    }

    const date = getTodayKey();
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, records }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.error || "Gagal menyimpan absensi.",
        missingCount: 0,
      };
    }

    return { success: true, savedAt: data.savedAt };
  }, [records, summary.belumDiabsen]);

  return { students, records, setStatus, summary, save, loading };
}
