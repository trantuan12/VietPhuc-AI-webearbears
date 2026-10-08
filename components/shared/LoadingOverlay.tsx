import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-sm font-semibold tracking-wide text-neutral-200">
          Đang Phân Tích...
        </span>
      </div>
    </div>
  );
};
