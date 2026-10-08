import React, { useState, useEffect } from "react";
import { StylistApiResponse } from "@/types/api";
import { EvaluationResult, TargetVisual, CulturalAnchor, ApprovedFact } from "@/types/culture";
import {
  ShieldAlert,
  ShieldCheck,
  Wrench,
  Loader2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react";

interface CultureGuardPanelProps {
  apiResponse: StylistApiResponse | null;
  selectedAnchorIds: string[];
  isRepairing: boolean;
  onRepair: () => void;
  defaultAnchors: CulturalAnchor[];
  defaultFacts: ApprovedFact[];
}

export const StatusBadge: React.FC<{ status: EvaluationResult }> = ({ status }) => {
  switch (status) {
    case "safe":
      return (
        <span className="text-xs px-3 py-0.5 rounded-full font-bold border bg-emerald-50 border-emerald-300 text-emerald-700 shrink-0">
          Chuẩn mực
        </span>
      );
    case "caution":
      return (
        <span className="text-xs px-3 py-0.5 rounded-full font-bold border bg-amber-50 border-amber-300 text-amber-700 shrink-0">
          Lưu ý
        </span>
      );
    case "conflict":
      return (
        <span className="text-xs px-3 py-0.5 rounded-full font-bold border bg-rose-50 border-rose-300 text-rose-700 shrink-0">
          Xung đột
        </span>
      );
    case "unknown":
    default:
      return (
        <span className="text-xs px-3 py-0.5 rounded-full font-medium border bg-stone-100 border-stone-200 text-stone-500 shrink-0">
          Chưa đánh giá
        </span>
      );
  }
};

const VISUAL_NAME_MAP: Record<TargetVisual, string> = {
  collar: "Cổ áo",
  torso: "Thân áo",
  feet: "Giày / Chân",
  head: "Đầu / Nón",
  bag: "Phụ kiện",
};

const ANCHOR_REGION_BADGE: Record<TargetVisual, string> = {
  collar: "Cổ Áo",
  torso: "Thân Áo",
  feet: "Chân / Giày",
  head: "Vùng Đầu",
  bag: "Phụ Kiện",
};

export const CultureGuardPanel: React.FC<CultureGuardPanelProps> = ({
  apiResponse,
  selectedAnchorIds,
  isRepairing,
  onRepair,
  defaultAnchors,
  defaultFacts,
}) => {
  const [isXrayOpen, setIsXrayOpen] = useState(true);

  useEffect(() => {
    if (selectedAnchorIds.length > 0) {
      setIsXrayOpen(true);
    }
  }, [selectedAnchorIds]);

  const scoreData = apiResponse?.cultural_evaluation?.score;
  const status: EvaluationResult = scoreData?.status ?? "unknown";
  const findings = apiResponse?.cultural_evaluation?.findings ?? [];
  const repairData = apiResponse?.repair_data;
  const canRepair = repairData?.can_repair === true;
  const reason = repairData?.reason || repairData?.repair_reason;

  const anchors = apiResponse?.cultural_content?.anchors ?? defaultAnchors;
  const facts = apiResponse?.cultural_content?.educational_facts ?? defaultFacts;

  const visualState = apiResponse?.visual_state;
  const targetVisuals =
    anchors.length > 0
      ? anchors.map((a) => a.target_visual)
      : (["collar", "torso", "torso"] as TargetVisual[]);

  let safeCount = 0;
  let cautionCount = 0;
  let conflictCount = 0;
  let unknownCount = 0;

  for (const tv of targetVisuals) {
    const st: EvaluationResult = visualState ? visualState[tv] || "unknown" : "unknown";
    if (st === "safe") safeCount++;
    else if (st === "caution") cautionCount++;
    else if (st === "conflict") conflictCount++;
    else unknownCount++;
  }

  const getReasonMessage = (r: string) => {
    if (r === "semantic_conflict_requires_user_adjustment") {
      return "Yêu cầu chỉnh sửa trực tiếp mô tả để tránh xung đột phom áo.";
    }
    if (r === "no_candidates_available") {
      return "Không có phụ kiện thay thế phù hợp với sự kiện này.";
    }
    if (r === "repair_selection_failed") {
      return "Không thể chọn được phụ kiện thay thế phù hợp với phong cách.";
    }
    return r || "Không thể tự động sửa bản phối.";
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-3xl bg-white border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none text-stone-800">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          {status === "conflict" ? (
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          ) : status === "safe" ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-[#E07A5F] shrink-0" />
          )}
          <div>
            <h2 className="text-sm font-bold text-stone-900 leading-tight">Culture Guard</h2>
            <p className="text-[11px] text-stone-500">Cố vấn chuẩn mực di sản</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* 2. Khối Điểm Chuẩn Mực Di Sản */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col gap-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-700 font-bold block leading-tight">
              Điểm Chuẩn Mực Di Sản
            </span>
            <span className="text-[10px] uppercase text-stone-400 tracking-wider font-semibold">
              Heritage Integrity
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            {scoreData && scoreData.total !== null ? `${scoreData.total}/100` : "--/100"}
          </div>
        </div>

        {scoreData && scoreData.breakdown && (
          <div className="pt-2 border-t border-stone-200/80 flex flex-col gap-1 text-[11px] text-stone-600">
            <div className="flex justify-between">
              <span>Điểm cốt lõi di sản</span>
              <span className="font-bold text-stone-800">
                {scoreData.breakdown.cultural_anchor}/60
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bối cảnh sự kiện</span>
              <span className="font-bold text-stone-800">
                {scoreData.breakdown.event_context}/25
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tương thích phối đồ (Remix)</span>
              <span className="font-bold text-stone-800">
                {scoreData.breakdown.remix_compatibility}/15
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Cultural Diff */}
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col gap-2 shadow-2xs">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Cultural Diff (Độ Lệch Văn Hóa)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{safeCount} Giữ nguyên</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{cautionCount} Cảnh báo</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>{conflictCount} Xung đột</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
            <span>{unknownCount} Chưa kiểm tra</span>
          </div>
        </div>
      </div>

      {/* 4. Đánh giá chi tiết (Findings) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Đánh Giá Chi Tiết ({findings.length})
        </span>
        {findings.length === 0 ? (
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-500 italic">
            Không phát hiện xung đột quy chuẩn văn hóa. Bản phối an toàn.
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {findings.map((f, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-xs flex flex-col gap-1 ${
                  f.result === "conflict"
                    ? "bg-rose-50/70 border-rose-200 text-rose-900"
                    : "bg-amber-50/70 border-amber-200 text-amber-900"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{VISUAL_NAME_MAP[f.target_visual] || f.target_visual}</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-full border bg-white font-bold">
                    {f.result === "conflict" ? "Xung đột" : "Lưu ý"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed mt-0.5">{f.explanation}</p>
                {f.evidence && (
                  <span className="text-[10px] opacity-80 italic">Từ prompt: "{f.evidence}"</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Nút Khắc Phục Bản Phối (Repair) */}
      {status === "conflict" && (
        <div className="flex flex-col gap-1.5 pt-1">
          {canRepair ? (
            <button
              onClick={onRepair}
              disabled={isRepairing}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              {isRepairing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tự động điều chỉnh...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Tự Động Sửa Bản Phối</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-2.5 rounded-2xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600">
              {getReasonMessage(reason || "")}
            </div>
          )}
        </div>
      )}

      {/* 6. Cultural X-Ray (Điểm neo di sản & Dữ liệu xác minh) */}
      <div className="flex flex-col border border-stone-200/90 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => setIsXrayOpen(!isXrayOpen)}
          className="w-full p-3 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Cultural X-Ray (Soi Di Sản)</span>
          </div>
          {isXrayOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {isXrayOpen && (
          <div className="p-3.5 bg-white flex flex-col gap-3.5 max-h-64 overflow-y-auto">
            {/* Anchors */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                Điểm Neo Cốt Lõi (Anchors)
              </span>
              {anchors.map((anc) => {
                const isSelected = selectedAnchorIds.includes(anc.id);
                return (
                  <div
                    key={anc.id}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1 transition-all ${
                      isSelected
                        ? "bg-[#E07A5F]/10 border-[#E07A5F] shadow-2xs"
                        : "bg-stone-50 border-stone-200/70"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-stone-900">
                      <span>{anc.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600">
                        {ANCHOR_REGION_BADGE[anc.target_visual] || anc.target_visual}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{anc.description}</p>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                      Nguồn: {anc.source_ids.join(", ")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Facts */}
            {facts.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
                <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                  Dữ Liệu Văn Hóa Xác Minh
                </span>
                {facts.map((fact) => (
                  <div key={fact.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px] text-stone-600 leading-relaxed">
                    💡 {fact.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
