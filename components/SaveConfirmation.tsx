import { CheckCircle2, AlertTriangle, X } from "lucide-react";

type SaveConfirmationProps = {
  type: "success" | "warning";
  message: string;
  onDismiss: () => void;
};

const STYLES = {
  success: {
    container: "border-green-300/50 bg-green-400/20 text-green-800",
    icon: <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />,
  },
  warning: {
    container: "border-amber-300/50 bg-amber-400/20 text-amber-800",
    icon: <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />,
  },
} as const;

export function SaveConfirmation({ type, message, onDismiss }: SaveConfirmationProps) {
  const style = STYLES[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl ${style.container}`}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/40"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
