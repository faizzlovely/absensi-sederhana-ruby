import { Save } from "lucide-react";

type SubmitButtonProps = {
  onSave: () => void;
  isSaving: boolean;
};

export function SubmitButton({ onSave, isSaving }: SubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={isSaving}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-300/50 bg-blue-500/70 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <Save className="h-5 w-5" strokeWidth={2.5} />
      {isSaving ? "Menyimpan..." : "Simpan Absensi"}
    </button>
  );
}
