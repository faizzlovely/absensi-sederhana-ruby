import { StudentItem } from "@/components/StudentItem";
import type { Student, AttendanceStatus } from "@/types";

type StudentListProps = {
  students: Student[];
  getStatus: (studentId: string) => AttendanceStatus;
  onSetStatus: (studentId: string, status: AttendanceStatus) => void;
};

export function StudentList({ students, getStatus, onSetStatus }: StudentListProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {students.map((student) => (
        <StudentItem
          key={student.id}
          name={student.name}
          status={getStatus(student.id)}
          onSetStatus={(status) => onSetStatus(student.id, status)}
        />
      ))}
    </div>
  );
}
