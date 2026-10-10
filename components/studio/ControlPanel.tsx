import React from "react";
import { RemixTier } from "@/types/culture";
import garmentsData from "@/data/garments.json" with { type: "json" };
import { AnimeFashionAvatar } from "./AnimeFashionAvatar";
import {
  Sparkles,
  Calendar,
  PenTool,
  Wand2,
  Loader2,
  Shirt,
  Check,
  Lightbulb,
  Building2,
  Scale,
  Rocket,
} from "lucide-react";

interface ControlPanelProps {
  garmentId: string;
  setGarmentId: (id: string) => void;
  eventId: string;
  setEventId: (id: string) => void;
  remixTier: RemixTier;
  setRemixTier: (tier: RemixTier) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  gender?: "female" | "male";
  modelUsed?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  garmentId,
  setGarmentId,
  eventId,
  setEventId,
  remixTier,
  setRemixTier,
  prompt,
  setPrompt,
  onSubmit,
  isLoading,
  gender = "female",
  modelUsed,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  const garments = garmentsData as any[];

  // Dynamic garment label mapping based on gender
  const garmentDisplayData: Record<
    string,
    { femaleName: string; maleName: string; femaleSub: string; maleSub: string }
  > = {
    garment_nguthan_01: {
      femaleName: "Áo Ngũ Thân",
      maleName: "Áo Ngũ Thân Nam",
      femaleSub: "Triều Nguyễn",
      maleSub: "Triều Nguyễn",
    },
    garment_aodai_01: {
      femaleName: "Áo Dài",
      maleName: "Áo Gấm Cách Tân",
      femaleSub: "Cận & Đương đại",
      maleSub: "Quan lại Lễ nghi",
    },
    garment_tuthan_01: {
      femaleName: "Áo Tứ Thân",
      maleName: "Y Phục Liền Anh",
      femaleSub: "Dân gian Bắc Bộ",
      maleSub: "Liền Anh Quan Họ",
    },
    garment_nhatbinh_01: {
      femaleName: "Áo Nhật Bình",
      maleName: "Áo Đại Cổ Nam",
      femaleSub: "Hoàng triều Nguyễn",
      maleSub: "Hoàng tộc Nam giới",
    },
  };

  const contextOptions = [
    {
      id: "event_grad",
      label: "Kỷ Yếu",
      sub: "Thanh xuân rực rỡ",
      image: "/images/context/ky_yeu.jpg",
    },
    {
      id: "event_street",
      label: "Dạo Phố",
      sub: "Năng động, hiện đại",
      image: "/images/context/dao_pho.jpg",
    },
    {
      id: "event_ceremony",
      label: "Lễ Hội",
      sub: "Truyền thống, văn hóa",
      image: "/images/context/le_hoi.jpg",
    },
  ];

  const quickPrompts = [
    "Tone xanh ngọc, hoạ tiết rồng phượng, phối túi canvas",
    "Áo dài trắng kỷ yếu tinh khôi, giày sneaker trắng",
    "Nhật bình quyền quý, quạt lụa đào sang trọng",
    "Tứ thân yếm đào trẩy hội xuân Bắc Bộ",
  ];

  const maxPromptChars = 300;

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-3xl bg-white border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none text-stone-800">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* ===================================================================
            1. CHỌN DÒNG CỔ PHỤC VIỆT (4 VISUAL CARDS)
        ==================================================================== */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-stone-900 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
              <span>1. CHỌN DÒNG CỔ PHỤC VIỆT</span>
            </label>
          </div>
          <p className="text-[10.5px] text-stone-500 font-normal">
            Chọn trang phục truyền thống làm nền tảng phối đồ
          </p>

          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {garments.map((g) => {
              const isSelected = g.id === garmentId;
              const meta = garmentDisplayData[g.id] || {
                femaleName: g.name.split(" (")[0],
                maleName: g.name.split(" (")[0],
                femaleSub: g.dynasty.split(" (")[0],
                maleSub: g.dynasty.split(" (")[0],
              };
              const title = gender === "female" ? meta.femaleName : meta.maleName;
              const subtitle = gender === "female" ? meta.femaleSub : meta.maleSub;

              return (
                <button
                  key={g.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setGarmentId(g.id)}
                  className={`flex flex-col items-center p-1.5 sm:p-2 rounded-xl border text-center transition-all cursor-pointer relative group ${
                    isSelected
                      ? "bg-[#E07A5F]/10 border-[#E07A5F] ring-1 ring-[#E07A5F] shadow-xs"
                      : "bg-white border-stone-200/90 hover:border-stone-300 hover:shadow-xs"
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#E07A5F] flex items-center justify-center text-white shadow-2xs z-10">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </span>
                  )}

                  {/* Model preview silhouette */}
                  <div className="w-full h-16 sm:h-18 rounded-lg overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100/70 flex items-center justify-center relative my-0.5 p-0.5">
                    <div className="w-full h-full flex items-center justify-center pointer-events-none scale-90">
                      <AnimeFashionAvatar
                        gender={gender}
                        garmentId={g.id}
                        outfitConfig={g.original_visual_config}
                        showXRay={false}
                        selectedTargetVisual={null}
                        onSelectHotspot={() => {}}
                        visualState={{ collar: "", torso: "", feet: "", head: "", bag: "" }}
                        viewAngle="front"
                        idPrefix={`card_${g.id}_${gender}`}
                      />
                    </div>
                  </div>

                  {/* Garment Title & Subtitle */}
                  <span className="text-[10.5px] sm:text-[11px] font-bold text-stone-900 leading-tight w-full mt-1">
                    {title}
                  </span>
                  <span className="text-[9px] sm:text-[9.5px] text-stone-500 font-medium leading-tight w-full mt-0.5 line-clamp-2">
                    {subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            2. TẦNG PHỐI ĐỒ (REMIX TIER)
        ==================================================================== */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-stone-900 tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
            <span>2. TẦNG PHỐI ĐỒ (REMIX TIER)</span>
          </label>
          <p className="text-[10.5px] text-stone-500 font-normal">
            Chọn mức độ kết hợp giữa truyền thống và đương đại
          </p>

          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            {[
              { id: "classic", label: "Cổ Điển", desc: "Nguyên bản", icon: Building2 },
              { id: "fusion", label: "Giao Thoa", desc: "Đương đại", icon: Scale },
              { id: "genz", label: "Gen Z", desc: "Phá cách", icon: Rocket },
            ].map((tier) => {
              const isSelected = remixTier === tier.id;
              const IconComp = tier.icon;
              return (
                <button
                  key={tier.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setRemixTier(tier.id as any)}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-[#E07A5F]/10 border-[#E07A5F] ring-1 ring-[#E07A5F]/40 shadow-xs"
                      : "bg-stone-50/70 border-stone-200/80 hover:bg-stone-100 hover:border-stone-300"
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#E07A5F] flex items-center justify-center text-white">
                      <Check className="w-1.5 h-1.5 stroke-[3]" />
                    </span>
                  )}
                  <IconComp
                    className={`w-3.5 h-3.5 mb-0.5 ${
                      isSelected ? "text-[#E07A5F]" : "text-stone-500"
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-bold leading-tight ${
                      isSelected ? "text-[#E07A5F]" : "text-stone-800"
                    }`}
                  >
                    {tier.label}
                  </span>
                  <span className="text-[9.5px] text-stone-500 mt-0.5">
                    {tier.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            3. NHẬP Ý TƯỞNG THỜI TRANG (PROMPT COMPOSER)
        ==================================================================== */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="fashion-prompt-input"
              className="text-xs font-black text-stone-900 tracking-wider uppercase flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
              <span>3. NHẬP Ý TƯỞNG THỜI TRANG</span>
            </label>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1 shadow-2xs"
                title="Hệ thống tự động đổi sang model kế tiếp trong pool khi chạm rate limit hoặc hết quota"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{modelUsed ? `AI: ${modelUsed.replace('gemini-', '')}` : 'AI: Auto-Failover (9 Models)'}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const random = quickPrompts[Math.floor(Math.random() * quickPrompts.length)];
                  setPrompt(random);
                }}
                className="text-[11px] font-bold text-[#E07A5F] hover:text-[#d3694e] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Gợi ý prompt</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="fashion-prompt-input"
              rows={2}
              maxLength={maxPromptChars}
              value={prompt}
              disabled={isLoading}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="VD: Tone xanh ngọc, hoạ tiết rồng phượng, phối phụ kiện hiện đại như túi, sneaker..."
              className="w-full resize-none p-3.5 pb-7 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-[#E07A5F] focus:bg-white focus:ring-1 focus:ring-[#E07A5F] transition-all leading-relaxed shadow-2xs"
            />
            {/* Character counter */}
            <span className="absolute bottom-2.5 right-3 text-[10px] text-stone-400 font-medium">
              {prompt.length}/{maxPromptChars}
            </span>
          </div>

          {/* Quick suggestions chips */}
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(qp)}
                className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-[#E07A5F]/10 border border-stone-200/80 hover:border-[#E07A5F]/40 text-[10px] text-stone-600 hover:text-[#E07A5F] transition-all text-left font-medium cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================================
            5. FULL-WIDTH CTA BUTTON: KHÁM PHÁ BẢN PHỐI NGAY
        ==================================================================== */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#E07A5F] via-[#E28369] to-[#D96B4F] hover:from-[#d86e52] hover:to-[#cd5f43] active:scale-[0.98] text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#E07A5F]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group"
        >
          {/* Subtle Vietnamese Cloud Motif Overlay in Button */}
          <div
            className="absolute inset-0 opacity-10 bg-repeat pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 10px 10px, white 2px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>AI Đang Phối Đồ & Thẩm Định...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>✨ KHÁM PHÁ BẢN PHỐI NGAY →</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
