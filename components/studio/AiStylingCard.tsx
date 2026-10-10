import React, { useState } from "react";
import { StylistApiResponse } from "@/types/api";
import { RemixTier, InventoryItem, EventData } from "@/types/culture";
import inventoryData from "@/data/inventory.json" with { type: "json" };
import eventsData from "@/data/events.json" with { type: "json" };
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";

const inventory: InventoryItem[] = inventoryData as InventoryItem[];
const events: EventData[] = eventsData as EventData[];

interface AiStylingCardProps {
  apiResponse: StylistApiResponse;
  eventId: string;
  remixTier: RemixTier;
}

const TIER_NAMES: Record<RemixTier, string> = {
  classic: "Cổ Điển",
  fusion: "Giao Thoa",
  genz: "Gen Z",
  preserve: "Bảo Tồn",
  avant_garde: "Tiên Phong",
};

export const AiStylingCard: React.FC<AiStylingCardProps> = ({
  apiResponse,
  eventId,
  remixTier,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const outfit = (apiResponse as any)?.outfit_config || {};
  const intent = (apiResponse as any)?.interpreted_intent;
  const scoreVal = (apiResponse as any)?.cultural_evaluation?.score;

  const currentEvent = events.find((e) => e.id === eventId);
  const eventName = currentEvent ? currentEvent.name : eventId;

  const accessoryItems = (outfit.accessories || [])
    .map((id: string) => inventory.find((i) => i.id === id))
    .filter((i: any): i is InventoryItem => Boolean(i));

  const status = typeof scoreVal === "object" ? scoreVal?.status : (Number(scoreVal) >= 80 ? "safe" : "caution");

  const getStatusBadge = () => {
    switch (status) {
      case "safe":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>An toàn (Chuẩn mực)</span>
          </span>
        );
      case "caution":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Lưu ý văn hóa</span>
          </span>
        );
      case "conflict":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 border border-rose-500/40 text-rose-400">
            <XCircle className="w-3 h-3" />
            <span>Xung đột quy tắc</span>
          </span>
        );
      case "unknown":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-800 border border-neutral-700 text-neutral-400">
            <HelpCircle className="w-3 h-3" />
            <span>Chưa đánh giá</span>
          </span>
        );
    }
  };

  // Trạng thái thu gọn: thanh bar mini tinh gọn không che mô hình 3D
  if (isCollapsed) {
    return (
      <div className="px-3.5 py-2 rounded-xl bg-neutral-950/85 border border-neutral-800/90 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-xs text-neutral-300">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase text-[11px] hidden sm:inline">Bản phối AI:</span>
          </div>
          <span className="font-semibold text-neutral-100 truncate text-[11px]">
            {intent?.vibe || "Ngũ thân đương đại"}
          </span>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-1">
            <span
              className="w-3 h-3 rounded-full border border-neutral-700 shadow-xs"
              style={{ backgroundColor: outfit.colors.body }}
              title={`Thân: ${outfit.colors.body}`}
            />
            <span
              className="w-3 h-3 rounded-full border border-neutral-700 shadow-xs"
              style={{ backgroundColor: outfit.colors.collar }}
              title={`Cổ: ${outfit.colors.collar}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge()}
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Mở rộng chi tiết bản phối"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Trạng thái mở rộng đầy đủ
  return (
    <div className="p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800/90 backdrop-blur-xl shadow-2xl flex flex-col gap-2.5 text-xs text-neutral-300 animate-in fade-in duration-200">
      {/* Header Bản phối AI */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase text-[11px]">Bản phối AI</span>
          </div>
          <div>{getStatusBadge()}</div>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-[10px] transition-colors"
          title="Thu gọn"
        >
          <span>Thu gọn</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Phong cách & Tầng phối */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-neutral-400 text-[11px]">Phong cách:</span>
        <span className="font-semibold text-neutral-100 text-right truncate">
          {intent?.vibe || "Ngũ thân đương đại"} · {TIER_NAMES[remixTier]}
        </span>
      </div>

      {/* Bối cảnh sự kiện */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-neutral-400 text-[11px]">Bối cảnh:</span>
        <span className="font-medium text-neutral-200 text-right truncate">
          {eventName}
        </span>
      </div>

      {/* Hai Swatches Màu chính & Cổ áo */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/60">
        <span className="text-neutral-400 text-[11px]">Bảng màu:</span>
        <div className="flex items-center gap-3">
          {/* Màu chính */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-md border border-neutral-700 shadow-xs shrink-0"
              style={{ backgroundColor: outfit.colors.body }}
            />
            <span className="font-mono text-[10px] text-neutral-300">
              Thân {outfit.colors.body}
            </span>
          </div>

          {/* Cổ áo */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-md border border-neutral-700 shadow-xs shrink-0"
              style={{ backgroundColor: outfit.colors.collar }}
            />
            <span className="font-mono text-[10px] text-neutral-300">
              Cổ {outfit.colors.collar}
            </span>
          </div>
        </div>
      </div>

      {/* Phụ kiện được chọn */}
      <div className="flex items-start justify-between gap-2 pt-1 border-t border-neutral-800/60">
        <span className="text-neutral-400 text-[11px] shrink-0 mt-0.5">Phụ kiện:</span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {accessoryItems.length > 0 ? (
            accessoryItems.map((item: any) => (
              <span
                key={item.id}
                className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-200 font-medium"
              >
                {item.name}
              </span>
            ))
          ) : (
            <span className="text-neutral-500 italic text-[11px]">
              Không có phụ kiện đính kèm
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
