export type AttendanceStatus = "hadir" | "tidak_hadir" | null;

export type Student = {
  id: string;
  name: string;
};

export type AttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
};
