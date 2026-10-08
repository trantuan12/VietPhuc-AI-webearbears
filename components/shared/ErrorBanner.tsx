import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  error: string | null;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="fixed top-20 right-6 z-50 w-full max-w-md p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500/80 text-rose-100 backdrop-blur-xl shadow-2xl shadow-rose-950/50 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-3 ring-4 ring-rose-500/20"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-900/80 border border-rose-500/50 shrink-0 text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
            <span>⚠️ THÔNG BÁO SỰ CỐ AI</span>
          </h4>
          <p className="text-xs font-medium leading-relaxed text-rose-100">{error}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Đóng thông báo"
        className="p-1.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-900/60 transition shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
