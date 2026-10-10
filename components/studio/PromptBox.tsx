import React from "react";
import { Sparkles, Wand2, Lightbulb } from "lucide-react";

interface PromptBoxProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onSubmit: (customPrompt?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "áo ngũ thân tone xanh than, tối giản, phối sneaker trắng",
  "áo ngũ thân đen huyền bí, phong cách streetwear, phối combat boot",
  "áo ngũ thân trang trọng đi kỷ yếu, phối mũ lưỡi trai thể thao",
  "áo ngũ thân truyền thống Đàng Trong, đội khăn đóng màu lam",
  "áo ngũ thân cách tân chiết eo bó sát ôm body",
];

export const PromptBox: React.FC<PromptBoxProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isLoading,
  disabled = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || isLoading) return;
    onSubmit();
  };

  const handleApplySuggestion = (sug: string) => {
    if (disabled || isLoading) return;
    setPrompt(sug);
    onSubmit(sug);
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="prompt-input"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ý tưởng phối đồ bằng lời bình thường</span>
          </label>
          <span className="text-[11px] text-neutral-500">Màu sắc & Phụ kiện</span>
        </div>

        <div className="relative">
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={disabled || isLoading}
            placeholder='Ví dụ: "áo ngũ thân tone xanh than, tối giản, phối sneaker trắng"...'
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none disabled:opacity-50"
          />

          <div className="flex items-center justify-between mt-2">
            <div className="text-[11px] text-neutral-500 flex items-center gap-1">
              <span>Gemini gợi ý màu & phụ kiện • Code kiểm tra luật di sản</span>
            </div>

            <button
              type="submit"
              disabled={disabled || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-semibold text-xs tracking-wide transition shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Tạo bản phối & Kiểm tra</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Gợi ý ý tưởng nhanh */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Gợi ý thử nghiệm nhanh:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              disabled={disabled || isLoading}
              onClick={() => handleApplySuggestion(sug)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-850 hover:border-amber-500/40 border border-neutral-800/80 text-neutral-300 hover:text-amber-200 transition text-left cursor-pointer disabled:opacity-50"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
