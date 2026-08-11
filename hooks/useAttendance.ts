import { useCallback, useMemo, useState } from "react";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { students } from "@/data/students";

export type SaveResult =
  | { success: true; savedAt: string }
  | { success: false; message: string; missingCount: number };

const STORAGE_PREFIX = "absensi-";

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createEmptyRecords(): AttendanceRecord[] {
  return students.map((student) => ({
    studentId: student.id,
    status: null,
  }));
}

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(createEmptyRecords);

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

  const save = useCallback((): SaveResult => {
    const missingCount = summary.belumDiabsen;

    if (missingCount > 0) {
      return {
        success: false,
        message: `Masih ada ${missingCount} siswa yang belum diabsen.`,
        missingCount,
      };
    }

    const savedAt = new Date().toISOString();
    const storageKey = `${STORAGE_PREFIX}${getTodayKey()}`;
    const payload = { records, savedAt };

    localStorage.setItem(storageKey, JSON.stringify(payload));

    return { success: true, savedAt };
  }, [records, summary.belumDiabsen]);

  return { records, setStatus, summary, save };
}
