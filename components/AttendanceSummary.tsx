import { CheckCircle2, XCircle, Clock3 } from "lucide-react";

type AttendanceSummaryProps = {
  hadir: number;
  tidakHadir: number;
  belumDiabsen: number;
  total: number;
};

const CARD_BASE =
  "flex flex-col items-center gap-1.5 rounded-2xl border border-white/40 bg-white/30 px-4 py-4 shadow-lg shadow-black/5 backdrop-blur-xl";

export function AttendanceSummary({
  hadir,
  tidakHadir,
  belumDiabsen,
  total,
}: AttendanceSummaryProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      <div className={`${CARD_BASE} text-green-700`}>
        <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} aria-hidden />
        <p className="text-2xl font-semibold text-gray-800">{hadir}</p>
        <p className="text-xs font-medium text-gray-600 sm:text-sm">Hadir</p>
      </div>
      <div className={`${CARD_BASE} text-red-700`}>
        <XCircle className="h-6 w-6" strokeWidth={2.5} aria-hidden />
        <p className="text-2xl font-semibold text-gray-800">{tidakHadir}</p>
        <p className="text-xs font-medium text-gray-600 sm:text-sm">Tidak Hadir</p>
      </div>
      <div className={`${CARD_BASE} text-amber-700`}>
        <Clock3 className="h-6 w-6" strokeWidth={2.5} aria-hidden />
        <p className="text-2xl font-semibold text-gray-800">{belumDiabsen}</p>
        <p className="text-xs font-medium text-gray-600 sm:text-sm">Belum Diabsen</p>
      </div>
      <p className="col-span-full text-center text-xs text-gray-500">
        Total siswa: {total}
      </p>
    </div>
  );
}
