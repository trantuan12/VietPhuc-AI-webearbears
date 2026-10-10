import React from "react";
import inventoryData from "../../data/inventory.json" with { type: "json" };
import { OutfitConfig } from "../../types/studio";
import { InterpretedIntent } from "../../types/ai";
import { InventoryItem } from "../../types/culture";
import { Palette, Sparkles, Tag } from "lucide-react";

const inventory: InventoryItem[] = inventoryData as InventoryItem[];

interface OutfitPaletteCardProps {
  outfitConfig: OutfitConfig;
  interpretedIntent: InterpretedIntent | null;
}

export const OutfitPaletteCard: React.FC<OutfitPaletteCardProps> = ({
  outfitConfig,
  interpretedIntent,
}) => {
  const accessories = outfitConfig.accessories
    .map((id) => inventory.find((i) => i.id === id))
    .filter((i): i is InventoryItem => Boolean(i));

  return (
    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wide">
            Bản phối đương đại & Phụ kiện
          </h3>
        </div>
        {interpretedIntent && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
            Độ tương thích vibe: {interpretedIntent.style_match}
          </span>
        )}
      </div>

      {interpretedIntent && (
        <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{interpretedIntent.vibe}</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed pl-5">
            {interpretedIntent.palette_description}
          </p>
        </div>
      )}

      {/* Màu sắc áo & Nẹp cổ */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-neutral-950/40 border border-neutral-800 flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg border border-neutral-700 shadow-inner shrink-0"
            style={{ backgroundColor: outfitConfig.colors.body }}
          />
          <div>
            <span className="text-[10px] text-neutral-400 block font-medium">Màu thân áo</span>
            <span className="text-xs font-mono font-bold text-neutral-200">
              {outfitConfig.colors.body}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/40 border border-neutral-800 flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg border border-neutral-700 shadow-inner shrink-0"
            style={{ backgroundColor: outfitConfig.colors.collar }}
          />
          <div>
            <span className="text-[10px] text-neutral-400 block font-medium">Màu nẹp cổ</span>
            <span className="text-xs font-mono font-bold text-neutral-200">
              {outfitConfig.colors.collar}
            </span>
          </div>
        </div>
      </div>

      {/* Danh sách phụ kiện đang mặc */}
      <div className="flex flex-col gap-1.5 pt-1">
        <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
          <Tag className="w-3 h-3 text-neutral-500" />
          <span>Phụ kiện hiện thời ({accessories.length}):</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {accessories.length > 0 ? (
            accessories.map((item) => (
              <span
                key={item.id}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-medium text-neutral-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{item.name}</span>
                <span className="text-[10px] text-neutral-500 uppercase">({item.category})</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-neutral-500 italic">Không có phụ kiện đính kèm</span>
          )}
        </div>
      </div>
    </div>
  );
};
