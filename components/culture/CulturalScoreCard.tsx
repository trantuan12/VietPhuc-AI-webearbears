import React from "react";
import { CulturalScoreData } from "../../types/api";
import { Finding } from "../../types/ai";
import { TargetVisual } from "../../types/culture";
import { Shield, CheckCircle, AlertTriangle, XCircle, HelpCircle, Layers } from "lucide-react";

interface CulturalScoreCardProps {
  scoreData: CulturalScoreData;
  findings: Finding[];
  onSelectTargetVisual?: (target: TargetVisual) => void;
}

const STATUS_CONFIG = {
  safe: {
    label: "Hợp chuẩn di sản",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  },
  caution: {
    label: "Cần lưu ý văn hóa",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  },
  conflict: {
    label: "Xung đột quy tắc",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30",
    icon: <XCircle className="w-4 h-4 text-rose-400" />,
  },
  unknown: {
    label: "Chưa đủ dữ liệu",
    color: "text-neutral-400",
    bg: "bg-neutral-800/40 border-neutral-700/50",
    icon: <HelpCircle className="w-4 h-4 text-neutral-400" />,
  },
};

const VISUAL_LABELS: Record<TargetVisual, string> = {
  collar: "Cổ áo",
  torso: "Thân áo",
  head: "Đầu / Khăn nón",
  feet: "Chân / Giày dép",
  bag: "Túi xách",
};

export const CulturalScoreCard: React.FC<CulturalScoreCardProps> = ({
  scoreData,
  findings,
  onSelectTargetVisual,
}) => {
  const statusInfo = STATUS_CONFIG[scoreData.status] || STATUS_CONFIG.unknown;
  const isCapped = scoreData.total !== null && scoreData.total <= 49 && scoreData.status === "conflict";

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-xl">
      {/* Header: Điểm tổng & Trạng thái */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
              Điểm chuẩn hóa văn hóa
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Do thuật toán code tính toán độc lập theo bộ quy tắc di sản
          </p>
        </div>

        {/* Trạng thái */}
        <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.color}`}>
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Vòng tròn điểm số & 3 cột thành phần */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center pt-2 pb-2">
        {/* Điểm tổng */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
            Tổng điểm
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-4xl font-extrabold tracking-tight ${scoreData.total !== null && scoreData.total >= 80 ? "text-emerald-400" : scoreData.total !== null && scoreData.total >= 50 ? "text-amber-400" : "text-rose-400"}`}>
              {scoreData.total !== null ? scoreData.total : "--"}
            </span>
            <span className="text-xs text-neutral-500 font-semibold">/100</span>
          </div>
          {isCapped && (
            <span className="text-[9px] text-rose-400 mt-1 font-medium">
              * Giới hạn ≤49 do xung đột nghiêm trọng
            </span>
          )}
        </div>

        {/* 3 Cột điểm thành phần */}
        <div className="sm:col-span-3 grid grid-cols-3 gap-2">
          {/* Cốt lõi di sản */}
          <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-medium block">
                Cốt lõi di sản
              </span>
              <span className="text-xs text-neutral-500 block leading-tight mt-0.5">
                Cấu trúc & Phom dáng
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-lg font-bold text-neutral-200">
                {scoreData.breakdown.cultural_anchor}
              </span>
              <span className="text-[10px] text-neutral-500">/60</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1 mt-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1 rounded-full transition-all"
                style={{ width: `${(scoreData.breakdown.cultural_anchor / 60) * 100}%` }}
              />
            </div>
          </div>

          {/* Bối cảnh sự kiện */}
          <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-medium block">
                Bối cảnh sự kiện
              </span>
              <span className="text-xs text-neutral-500 block leading-tight mt-0.5">
                Phù hợp không gian
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-lg font-bold text-neutral-200">
                {scoreData.breakdown.event_context}
              </span>
              <span className="text-[10px] text-neutral-500">/25</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1 mt-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-1 rounded-full transition-all"
                style={{ width: `${(scoreData.breakdown.event_context / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Tương thích phối đồ */}
          <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-medium block">
                Tương thích phối đồ
              </span>
              <span className="text-xs text-neutral-500 block leading-tight mt-0.5">
                Hài hòa phụ kiện
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-lg font-bold text-neutral-200">
                {scoreData.breakdown.remix_compatibility}
              </span>
              <span className="text-[10px] text-neutral-500">/15</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1 rounded-full transition-all"
                style={{ width: `${(scoreData.breakdown.remix_compatibility / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách kết quả đánh giá quy tắc (Findings) */}
      <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Chi tiết đánh giá quy tắc ({findings.length})</span>
          </span>
          {findings.length === 0 && (
            <span className="text-xs text-emerald-400">Không có cảnh báo</span>
          )}
        </div>

        {findings.length === 0 ? (
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Bản phối đạt chuẩn mực tuyệt đối, không vi phạm quy tắc di sản nào.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {findings.map((f, idx) => {
              const isConflict = f.result === "conflict";
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 ${
                    isConflict
                      ? "bg-rose-950/20 border-rose-500/40 text-rose-200"
                      : "bg-amber-950/20 border-amber-500/40 text-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {isConflict ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="font-semibold uppercase tracking-wider text-[11px]">
                        {f.rule_id}
                      </span>
                      <span className="text-neutral-500">•</span>
                      <button
                        type="button"
                        onClick={() => f.target_visual && onSelectTargetVisual?.(f.target_visual)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 transition"
                      >
                        Vùng: {VISUAL_LABELS[f.target_visual] || f.target_visual}
                      </button>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        isConflict
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {isConflict ? "Xung đột" : "Lưu ý"}
                    </span>
                  </div>

                  <p className="text-neutral-200 leading-relaxed text-[11px]">
                    {f.explanation}
                  </p>

                  {f.evidence && (
                    <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                      <span>Dẫn chứng phát hiện:</span>
                      <span className="text-white px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                        "{f.evidence}"
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
