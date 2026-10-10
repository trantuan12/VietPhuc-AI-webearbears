import React from "react";
import { RemixTier } from "../../types/culture";
import { Compass, Sparkles, Flame, ShieldCheck } from "lucide-react";

interface RemixTierSelectorProps {
  currentTier: RemixTier;
  onSelectTier: (tier: RemixTier) => void;
  disabled?: boolean;
}

interface TierMeta {
  id: RemixTier;
  label: string;
  tagline: string;
  icon: React.ReactNode;
}

const TIERS: TierMeta[] = [
  {
    id: "classic",
    label: "Chuẩn cổ",
    tagline: "Chuẩn mực cổ phong, phụ kiện nguyên bản",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
  },
  {
    id: "fusion",
    label: "Giao thoa (Fusion)",
    tagline: "Hài hòa truyền thống & tối giản trẻ trung",
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
  },
  {
    id: "genz",
    label: "Phá cách Gen Z",
    tagline: "Streetwear, boot cổ cao, năng động",
    icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
  },
];

export const RemixTierSelector: React.FC<RemixTierSelectorProps> = ({
  currentTier,
  onSelectTier,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          <span>Tầng phối đồ (Remix Tier)</span>
        </label>
        <span className="text-[11px] text-neutral-500">Mức độ sáng tạo</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TIERS.map((tier) => {
          const isSelected = tier.id === currentTier;

          return (
            <button
              key={tier.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTier(tier.id)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {tier.icon}
                  <span className="text-xs font-semibold leading-snug">
                    {tier.label}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {tier.tagline}
                </p>
              </div>

              {isSelected && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Đang chọn</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
