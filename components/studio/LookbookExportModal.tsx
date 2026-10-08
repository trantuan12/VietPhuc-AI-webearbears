import React, { useState } from "react";
import { OutfitConfig } from "@/types/studio";
import { RemixTier, InventoryItem } from "@/types/culture";
import { StylistApiResponse } from "@/types/api";
import inventoryData from "@/data/inventory.json" with { type: "json" };
import garmentsData from "@/data/garments.json" with { type: "json" };
import eventsData from "@/data/events.json" with { type: "json" };
import { AnimeFashionAvatar } from "./AnimeFashionAvatar";
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  Shirt,
  Award,
} from "lucide-react";

const inventory: InventoryItem[] = inventoryData as InventoryItem[];

interface LookbookExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentId: string;
  outfitConfig: OutfitConfig;
  eventId: string;
  remixTier: RemixTier;
  apiResponse?: StylistApiResponse | null;
  userPrompt?: string;
}

export const LookbookExportModal: React.FC<LookbookExportModalProps> = ({
  isOpen,
  onClose,
  garmentId,
  outfitConfig,
  eventId,
  remixTier,
  apiResponse,
  userPrompt,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const garment = (garmentsData as any[]).find((g) => g.id === garmentId) || garmentsData[0];
  const event = (eventsData as any[]).find((e) => e.id === eventId) || eventsData[0];

  const bodyColor = outfitConfig?.colors?.body || "#DC2626";
  const collarColor = outfitConfig?.colors?.collar || "#FFFFFF";
  const pantsColor = outfitConfig?.colors?.pants || "#FFFFFF";
  const accessories = outfitConfig?.accessories || [];

  const equippedItems = accessories
    .map((id) => inventory.find((i) => i.id === id))
    .filter(Boolean) as InventoryItem[];

  const scoreTotal = apiResponse?.cultural_evaluation?.score?.total ?? 85;

  const title = apiResponse?.interpreted_intent?.vibe
    ? `${apiResponse.interpreted_intent.vibe.toUpperCase()} – ANIME CỔ PHỤC`
    : `VIỆT PHỤC GEN Z: ${garment.name.toUpperCase()}`;

  const story =
    apiResponse?.interpreted_intent?.editorial_story ||
    `Sự hòa quyện giữa cấu trúc di sản cổ phong nghìn năm và phong cách Anime thời thượng của Gen Z. Một tuyên ngôn thời trang vừa lưu giữ cốt cách văn hóa, vừa tự tin tỏa sáng.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Đã lưu thẻ Lookbook Anime Việt Phục thành công!");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-stone-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-[#E07A5F]">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold tracking-widest uppercase">
            LOOKBOOK ANIME VIỆT PHỤC
          </span>
        </div>

        {/* THE EDITORIAL LOOKBOOK CARD */}
        <div
          id="lookbook-card"
          className="relative rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-[#F3EFEA] border border-[#E07A5F]/30 p-5 sm:p-6 shadow-md flex flex-col gap-4 text-stone-800 overflow-hidden"
        >
          {/* Top Badge */}
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-[#E07A5F]" />
              <span className="text-xs font-bold text-stone-800">{garment.name}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E07A5F]/15 border border-[#E07A5F]/30 text-[#E07A5F] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{scoreTotal}/100 Điểm Di Sản</span>
            </div>
          </div>

          {/* Model Preview & Details */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Live Anime Avatar Card Preview */}
            <div className="w-28 h-44 rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-md shrink-0 flex items-center justify-center p-1">
              <AnimeFashionAvatar
                gender="female"
                garmentId={garmentId}
                outfitConfig={outfitConfig}
                showXRay={false}
                selectedTargetVisual={null}
                onSelectHotspot={() => {}}
                visualState={{ collar: "safe", torso: "safe", feet: "safe", head: "safe", bag: "safe" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-stone-600 italic leading-relaxed">
                "{story}"
              </p>
            </div>
          </div>

          {/* Color Palette breakdown */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-200/80">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Bảng Màu Bản Phối (Palette)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-medium">
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: bodyColor }} />
                <span>Thân: <strong className="font-mono text-stone-800">{bodyColor}</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-medium">
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: collarColor }} />
                <span>Cổ: <strong className="font-mono text-stone-800">{collarColor}</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-medium">
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: pantsColor }} />
                <span>Quần: <strong className="font-mono text-stone-800">{pantsColor}</strong></span>
              </div>
            </div>
          </div>

          {/* Equipped Accessories */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Phụ Kiện Gen Z & Di Sản Đã Phối
            </span>
            <div className="flex flex-wrap gap-1.5">
              {equippedItems.length > 0 ? (
                equippedItems.map((item) => (
                  <span
                    key={item.id}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 font-medium"
                  >
                    ✓ {item.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-500 italic">Phong cách tối giản thanh lịch</span>
              )}
            </div>
          </div>

          {/* Footer of Card */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 text-[11px] text-stone-400 font-medium">
            <span>Bối cảnh: {event.name}</span>
            <span>Việt Phục Remix • Gemini AI</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={handleDownloadCard}
            disabled={downloading}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#D96B4F] hover:from-[#d86e52] hover:to-[#cd5f43] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#E07A5F]/25 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Đang xuất ảnh..." : "Tải Thẻ Lookbook"}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Đã chép link!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>Sao Chép Link Phối Đồ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
