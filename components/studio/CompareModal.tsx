import React from "react";
import { OutfitConfig } from "@/types/studio";
import { RemixTier, InventoryItem } from "@/types/culture";
import inventoryData from "@/data/inventory.json" with { type: "json" };
import garmentsData from "@/data/garments.json" with { type: "json" };
import { X, GitCompare, Shirt } from "lucide-react";

const inventory: InventoryItem[] = inventoryData as InventoryItem[];

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentId: string;
  currentConfig: OutfitConfig;
  savedConfig?: OutfitConfig | null;
  onSaveCurrentAsA: () => void;
  currentScore?: number | null;
  savedScore?: number | null;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  garmentId,
  currentConfig,
  savedConfig,
  onSaveCurrentAsA,
  currentScore = 85,
  savedScore = 90,
}) => {
  if (!isOpen) return null;

  const garment = (garmentsData as any[]).find((g) => g.id === garmentId) || garmentsData[0];

  const renderConfigCard = (config: OutfitConfig, score: number | null | undefined, label: string) => {
    const bodyColor = config?.colors?.body || "#1E3A8A";
    const collarColor = config?.colors?.collar || "#172554";
    const pantsColor = config?.colors?.pants || "#FFFFFF";
    const accessories = config?.accessories || [];

    const items = accessories
      .map((id) => inventory.find((i) => i.id === id))
      .filter(Boolean) as InventoryItem[];

    return (
      <div className="flex-1 flex flex-col gap-3.5 p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">{label}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#E07A5F]/15 border border-[#E07A5F]/30 text-[#E07A5F] text-[11px] font-bold">
            {score ?? 85}/100 Điểm Di Sản
          </span>
        </div>

        {/* Colors preview */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: bodyColor }} />
            <span className="text-stone-700 font-mono text-[11px]">{bodyColor}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: collarColor }} />
            <span className="text-stone-700 font-mono text-[11px]">{collarColor}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: pantsColor }} />
            <span className="text-stone-700 font-mono text-[11px]">{pantsColor}</span>
          </div>
        </div>

        {/* Accessories */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">Phụ Kiện Phối:</span>
          <div className="flex flex-wrap gap-1">
            {items.length > 0 ? (
              items.map((it) => (
                <span key={it.id} className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] text-stone-700 font-medium">
                  {it.name}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-stone-400 italic">Phong cách tối giản</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-stone-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#E07A5F]">
          <GitCompare className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
            So Sánh Phương Án Phối Đồ (A / B)
          </h2>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed -mt-1">
          Đối chiếu trực tiếp 2 phong cách phối đồ để đánh giá sự hài hòa màu sắc và điểm số chuẩn mực di sản.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          {savedConfig
            ? renderConfigCard(savedConfig, savedScore, "Phương Án A (Đã Lưu)")
            : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-stone-300 text-center gap-2">
                <span className="text-xs text-stone-400">Chưa lưu Phương Án A</span>
                <button
                  onClick={onSaveCurrentAsA}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#E07A5F] text-xs font-bold transition-all"
                >
                  Lưu bản phối hiện tại làm Bản A
                </button>
              </div>
            )}

          {renderConfigCard(currentConfig, currentScore, "Phương Án B (Hiện Tại)")}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
          <button
            onClick={onSaveCurrentAsA}
            className="px-4 py-2 rounded-xl bg-[#E07A5F]/15 hover:bg-[#E07A5F]/25 text-[#E07A5F] text-xs font-bold transition-all cursor-pointer"
          >
            Lưu bản hiện tại thành Bản A
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
