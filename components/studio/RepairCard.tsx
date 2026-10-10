import React from "react";
import inventoryData from "../../data/inventory.json" with { type: "json" };
import { InventoryItem } from "../../types/culture";
import { RepairDataResponse } from "../../types/api";
import { Wrench, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";

const inventory: InventoryItem[] = inventoryData as InventoryItem[];

interface RepairCardProps {
  repairData: RepairDataResponse;
  onRepair: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const RepairCard: React.FC<RepairCardProps> = ({
  repairData,
  onRepair,
  isLoading,
  disabled = false,
}) => {
  const conflictItem = repairData.conflict_item_id
    ? inventory.find((i) => i.id === repairData.conflict_item_id)
    : null;

  const candidateItems = (repairData.candidates || [])
    .map((id) => inventory.find((i) => i.id === id))
    .filter((i): i is InventoryItem => Boolean(i));

  const lastRepair = repairData.last_repair_info;
  const replacedItem = lastRepair ? inventory.find((i) => i.id === lastRepair.replaced_item_id) : null;
  const selectedCandidate = lastRepair ? inventory.find((i) => i.id === lastRepair.selected_candidate_id) : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Thông báo kết quả sau khi đã sửa thành công */}
      {lastRepair && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-emerald-300">
              Đã khắc phục xung đột phụ kiện thành công:
            </span>
            <div className="mt-1 flex items-center gap-1.5 font-medium text-neutral-200">
              <span className="line-through text-neutral-400">
                {replacedItem?.name || lastRepair.replaced_item_id}
              </span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                {selectedCandidate?.name || lastRepair.selected_candidate_id}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 ml-1">
                Tương thích: {lastRepair.vibe_match}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Thẻ đề xuất Sửa nhanh khi phát hiện xung đột phụ kiện */}
      {repairData.can_repair && conflictItem && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 shadow-lg flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                    Phát hiện xung đột phụ kiện
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">
                    Có thể sửa nhanh
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  Món đồ <strong className="text-white font-semibold">{conflictItem.name}</strong> không phù hợp với sự kiện đã chọn theo quy tắc ứng dụng.
                </p>
              </div>
            </div>
          </div>

          {candidateItems.length > 0 && (
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-300">
              <span className="text-neutral-400 block mb-1 font-medium">
                Ứng viên thay thế hợp chuẩn ({candidateItems.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {candidateItems.map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-0.5 rounded bg-neutral-800 text-amber-200 border border-neutral-700/60"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-neutral-400 italic">
              * Nếu sửa lỗi, bản phối hiện tại sẽ được giữ y nguyên.
            </span>
            <button
              type="button"
              disabled={disabled || isLoading}
              onClick={onRepair}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold text-xs tracking-wide transition shadow-lg shadow-rose-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang tìm món thay thế...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Sửa nhanh phụ kiện</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Trường hợp xung đột ngữ nghĩa (thân áo / 5 thân / chiết eo) */}
      {repairData.repair_reason === "semantic_conflict_requires_user_adjustment" && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-300">
              Lưu ý bảo tồn cấu trúc ngũ thân:
            </span>
            <p className="mt-1 text-[11px] text-neutral-300 leading-relaxed">
              Ý tưởng của bạn có yêu cầu can thiệp vào cấu trúc cốt lõi (như lược bỏ thân thứ năm hoặc chiết eo bó sát). Đây là lỗi thuộc cấu trúc áo nên không thể tự động thay thế bằng phụ kiện. Bạn hãy chỉnh sửa lại câu lệnh gợi ý nhé!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
