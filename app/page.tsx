"use client";

import { useCallback, useRef, useState } from "react";
import { AttendanceSummary } from "@/components/AttendanceSummary";
import { StudentList } from "@/components/StudentList";
import { SubmitButton } from "@/components/SubmitButton";
import { SaveConfirmation } from "@/components/SaveConfirmation";
import { useAttendance } from "@/hooks/useAttendance";
import type { SaveResult } from "@/hooks/useAttendance";

type Notification = {
  type: "success" | "warning";
  message: string;
};

export default function Home() {
  const { students, records, setStatus, summary, save, loading } = useAttendance();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getStatus = useCallback(
    (studentId: string) => {
      const record = records.find((item) => item.studentId === studentId);
      return record ? record.status : null;
    },
    [records]
  );

  const handleSave = useCallback(async (): Promise<void> => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    setIsSaving(true);
    const result: SaveResult = await save();
    setIsSaving(false);

    if (result.success) {
      setNotification({
        type: "success",
        message: `Absensi berhasil disimpan pada ${new Date(result.savedAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}.`,
      });
    } else {
      setNotification({ type: "warning", message: result.message });
    }

    saveTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, [save]);

  if (loading) {
    return (
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <p className="text-sm text-gray-600">Memuat data siswa...</p>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
          Absensi Siswa
        </h1>
        <p className="text-sm text-gray-600">
          Kelas 12 Rekayasa Perangkat Lunak — pilih status kehadiran untuk setiap siswa.
        </p>
      </header>

      <AttendanceSummary
        hadir={summary.hadir}
        tidakHadir={summary.tidakHadir}
        belumDiabsen={summary.belumDiabsen}
        total={students.length}
      />

      {notification && (
        <SaveConfirmation
          type={notification.type}
          message={notification.message}
          onDismiss={() => setNotification(null)}
        />
      )}

      <StudentList students={students} getStatus={getStatus} onSetStatus={setStatus} />

      <div className="flex w-full justify-center pt-2 sm:justify-end">
        <SubmitButton onSave={handleSave} isSaving={isSaving} />
      </div>
    </main>
  );
}
