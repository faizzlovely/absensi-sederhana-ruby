import { Check, X } from "lucide-react";
import type { AttendanceStatus } from "@/types";

type StudentItemProps = {
  name: string;
  status: AttendanceStatus;
  onSetStatus: (status: AttendanceStatus) => void;
};

const BUTTON_BASE =
  "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95";

const BUTTON_INACTIVE = "border-white/40 bg-white/20 text-gray-600 hover:bg-white/30";

export function StudentItem({ name, status, onSetStatus }: StudentItemProps) {
  const isHadir = status === "hadir";
  const isTidakHadir = status === "tidak_hadir";

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/40 bg-white/30 p-4 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/40">
      <div className="flex w-full items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-gray-800">{name}</p>
        {status !== null && (
          <span
            aria-label={`Status: ${status === "hadir" ? "hadir" : "tidak hadir"}`}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              isHadir ? "bg-green-400/30 text-green-700" : "bg-red-400/30 text-red-700"
            }`}
          >
            {isHadir ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
              <X className="h-4 w-4" strokeWidth={3} />
            )}
          </span>
        )}
      </div>

      <div className="flex w-full gap-2">
        <button
          type="button"
          aria-pressed={isHadir}
          onClick={() => onSetStatus(isHadir ? null : "hadir")}
          className={`${BUTTON_BASE} flex-1 justify-center ${
            isHadir ? "border-green-300/50 bg-green-400/30 text-green-700" : BUTTON_INACTIVE
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
          Hadir
        </button>
        <button
          type="button"
          aria-pressed={isTidakHadir}
          onClick={() => onSetStatus(isTidakHadir ? null : "tidak_hadir")}
          className={`${BUTTON_BASE} flex-1 justify-center ${
            isTidakHadir ? "border-red-300/50 bg-red-400/30 text-red-700" : BUTTON_INACTIVE
          }`}
        >
          <X className="h-4 w-4" strokeWidth={3} />
          Tidak Hadir
        </button>
      </div>
    </div>
  );
}
