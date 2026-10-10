import React, { useState, useRef } from "react";
import { OutfitConfig, VisualState, ViewAngle } from "@/types/studio";
import { TargetVisual, RemixTier } from "@/types/culture";
import { StylistApiResponse } from "@/types/api";
import garmentsData from "@/data/garments.json" with { type: "json" };
import { AnimeFashionAvatar, ModelGender } from "./AnimeFashionAvatar";
import { computeCalloutAnnotations } from "@/services/calloutHelper";
import {
  Sparkles,
  Scan,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Share2,
  GitCompare,
  Palette,
  Layers,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  Check,
  Eye,
} from "lucide-react";

interface InteractiveFashionAvatarStudioProps {
  garmentId: string;
  outfitConfig: OutfitConfig;
  visualState: VisualState;
  selectedTargetVisual: TargetVisual | null;
  onSelectHotspot: (targetVisual: TargetVisual, anchorIds: string[]) => void;
  apiResponse?: StylistApiResponse | null;
  eventId?: string;
  remixTier?: RemixTier;
  onOpenLookbook?: () => void;
  onOpenCompare?: () => void;
  onUpdateColors?: (colors: { body: string; collar: string; pants?: string; inner?: string; belt?: string }) => void;
  onToggleAccessory?: (accId: string) => void;
  onToggleMotif?: (motifId: string) => void;
  onToggleSticker?: (stickerId: string) => void;
  gender?: ModelGender;
  onGenderChange?: (gender: ModelGender) => void;
  onSelectGarment?: (id: string) => void;
  prompt?: string;
}

export const InteractiveFashionAvatarStudio: React.FC<InteractiveFashionAvatarStudioProps> = ({
  garmentId,
  outfitConfig,
  visualState,
  selectedTargetVisual,
  onSelectHotspot,
  apiResponse,
  eventId = "event_grad",
  remixTier = "fusion",
  onOpenLookbook,
  onOpenCompare,
  onUpdateColors,
  onToggleAccessory,
  onToggleMotif,
  onToggleSticker,
  gender: propGender,
  onGenderChange,
  onSelectGarment,
  prompt = "",
}) => {
  const [internalGender, setInternalGender] = useState<ModelGender>("female");
  const modelGender = propGender || internalGender;
  const setModelGender = (g: ModelGender) => {
    setInternalGender(g);
    onGenderChange?.(g);
    if (g === "female" && garmentId === "garment_nguthan_01") {
      onSelectGarment?.("garment_nhatbinh_01");
    } else if (g === "male" && garmentId === "garment_nhatbinh_01") {
      onSelectGarment?.("garment_nguthan_01");
    }
  };
  const [viewAngle, setViewAngle] = useState<ViewAngle>("front");
  const [showXRay, setShowXRay] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHeritageModal, setShowHeritageModal] = useState<boolean>(false);

  // Bottom dock tabs: "palette" | "motifs" | "accessories"
  const [activeBottomTab, setActiveBottomTab] = useState<"palette" | "motifs" | "accessories">("palette");

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollDockRef = useRef<HTMLDivElement>(null);

  const garments = garmentsData as any[];
  const currentGarment = garments.find((g) => g.id === garmentId) || garments[0];

  const bodyColor = outfitConfig?.colors?.body || currentGarment.original_visual_config.colors.body || "#047857";
  const accessories = outfitConfig?.accessories || [];
  const motifs = outfitConfig?.motifs || [];
  const stickers = outfitConfig?.stickers || [];

  // Dynamic callout annotations that respond instantly to garment selection, prompt, and AI styling
  const calloutAnnotations = computeCalloutAnnotations({
    garmentId,
    prompt,
    outfitConfig,
    gender: modelGender,
    remixTier,
    customFromAI: apiResponse?.interpreted_intent?.callout_annotations,
  });

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDockScroll = (direction: "left" | "right") => {
    if (scrollDockRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollDockRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Curated circular color presets
  const colorPresets = [
    { id: "terracotta", hex: "#E07A5F", name: "Đỏ Terracotta", pants: "#FFFFFF", collar: "#FAF8F5", inner: "#E11D48", belt: "#0284C7" },
    { id: "coral_pink", hex: "#FB7185", name: "Hồng San Hô", pants: "#FFF1F2", collar: "#FFFFFF", inner: "#FFFFFF", belt: "#FB7185" },
    { id: "amber_gold", hex: "#F59E0B", name: "Hoàng Yến Gold", pants: "#FFFFFF", collar: "#FEF3C7", inner: "#E11D48", belt: "#DC2626" },
    { id: "imperial_jade", hex: "#047857", name: "Nhật Bình Lục", pants: "#FFFFFF", collar: "#F59E0B", inner: "#FFFFFF", belt: "#F59E0B" },
    { id: "ocean_blue", hex: "#1E3A8A", name: "Lam Cung Đình", pants: "#0F172A", collar: "#FBBF24", inner: "#FFFFFF", belt: "#FBBF24" },
    { id: "royal_purple", hex: "#6D28D9", name: "Tím Huế Hoàng Gia", pants: "#1E1B4B", collar: "#FCD34D", inner: "#E11D48", belt: "#0284C7" },
    { id: "pure_white", hex: "#FFFFFF", name: "Bạch Ngọc Tinh Khôi", pants: "#38BDF8", collar: "#E2E8F0", inner: "#FFFFFF", belt: "#38BDF8" },
    { id: "obsidian_black", hex: "#1C1917", name: "Huyền Mặc Sang Trọng", pants: "#FFFFFF", collar: "#D97706", inner: "#E11D48", belt: "#D97706" },
    { id: "ruby_red", hex: "#DC2626", name: "Đỏ Thắm Cung Đình", pants: "#FFFFFF", collar: "#FFFFFF", inner: "#E11D48", belt: "#0284C7" },
    { id: "ochre_brown", hex: "#78350F", name: "Nâu Đất Tứ Thân", pants: "#0F172A", collar: "#D97706", inner: "#E11D48", belt: "#0D9488" },
  ];

  // Visual Motif Cards with authentic SVG pattern artwork
  const visualMotifs = [
    {
      id: "peony_brocade",
      motifId: "peach_blossom",
      title: "Gấm Hoa Mẫu Đơn",
      desc: "Vương giả phú quý",
      bgGradient: "from-amber-900/60 to-red-950/80",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="32" fill="#7C2D12" />
          <circle cx="40" cy="40" r="16" fill="#F43F5E" opacity="0.8" />
          <circle cx="40" cy="40" r="8" fill="#FDE047" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <ellipse key={i} cx="40" cy="22" rx="6" ry="12" fill="#FB7185" opacity="0.75" transform={`rotate(${a} 40 40)`} />
          ))}
        </svg>
      ),
    },
    {
      id: "golden_dragon",
      motifId: "dragon",
      title: "Rồng Hoàng Triều",
      desc: "Thêu chỉ kim tuyến",
      bgGradient: "from-amber-950 to-stone-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#1C1917" />
          <path d="M 20,55 Q 35,25 45,35 T 62,25 Q 55,48 40,50 T 25,60 Z" fill="#F59E0B" opacity="0.9" />
          <circle cx="58" cy="28" r="3" fill="#EF4444" />
          <path d="M 45,35 Q 55,30 52,22 Q 40,26 42,38 Z" fill="#FBBF24" />
          <circle cx="40" cy="40" r="4" fill="#FEF08A" />
        </svg>
      ),
    },
    {
      id: "flying_phoenix",
      motifId: "phoenix",
      title: "Phượng Hoàng Cung",
      desc: "Thanh cao tao nhã",
      bgGradient: "from-stone-900 to-amber-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#292524" />
          <path d="M 40,20 Q 30,35 22,55 Q 36,45 42,58 Q 48,45 58,55 Q 50,35 40,20 Z" fill="#F59E0B" opacity="0.9" />
          <circle cx="40" cy="22" r="3.5" fill="#EF4444" />
          <path d="M 38,28 Q 20,38 15,30 Q 25,44 38,36 Z" fill="#FBBF24" />
          <path d="M 42,28 Q 60,38 65,30 Q 55,44 42,36 Z" fill="#FBBF24" />
        </svg>
      ),
    },
    {
      id: "crane_lotus",
      motifId: "crane",
      title: "Hạc Ngậm Sen",
      desc: "Trường thọ cát tường",
      bgGradient: "from-stone-800 to-emerald-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#1C1917" />
          <path d="M 38,62 Q 40,40 50,30 Q 54,25 48,22 Q 42,25 36,36 Q 30,46 38,62 Z" fill="#F8FAFC" />
          <path d="M 48,22 L 56,20 L 49,24 Z" fill="#F59E0B" />
          <circle cx="47" cy="22" r="1.5" fill="#EF4444" />
          <path d="M 38,40 Q 22,38 18,48 Q 28,48 38,44 Z" fill="#94A3B8" />
        </svg>
      ),
    },
    {
      id: "cloud_swirl",
      motifId: "cloud_swirl",
      title: "Vân Mây Ngũ Sắc",
      desc: "Mây lành cung đình",
      bgGradient: "from-sky-950 to-indigo-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#1E293B" />
          <path d="M 24,46 C 24,38 32,36 36,40 C 38,32 50,32 54,38 C 60,38 62,46 56,50 C 50,54 28,54 24,46 Z" fill="#60A5FA" opacity="0.85" />
          <circle cx="36" cy="40" r="5" fill="#93C5FD" />
          <circle cx="48" cy="40" r="6" fill="#BFDBFE" />
        </svg>
      ),
    },
    {
      id: "cloud_black",
      motifId: "cloud_black",
      title: "Hắc Vân Anime",
      desc: "Mây đen phong cách Anime Wibu",
      bgGradient: "from-zinc-950 to-neutral-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#18181B" />
          <path d="M 22,48 C 22,38 32,34 38,38 C 42,28 54,28 58,36 C 64,36 66,46 58,52 C 50,56 26,56 22,48 Z" fill="#27272A" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M 32,44 Q 38,38 46,42 Q 52,40 50,48" stroke="#DC2626" strokeWidth="2" fill="none" />
          <circle cx="38" cy="42" r="3" fill="#DC2626" />
          <circle cx="48" cy="44" r="2" fill="#FBBF24" />
        </svg>
      ),
    },
    {
      id: "golden_leaves",
      motifId: "golden_leaves",
      title: "Lá Vàng Rơi",
      desc: "Hoàng diệp thu phong",
      bgGradient: "from-amber-950 to-stone-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#1C1917" />
          <path d="M 28,26 C 36,22 42,28 38,36 C 34,42 26,40 28,26 Z" fill="#F59E0B" />
          <path d="M 50,34 C 58,30 62,38 56,46 C 50,52 44,48 50,34 Z" fill="#FBBF24" />
          <path d="M 32,54 C 40,48 46,56 40,62 C 34,66 28,62 32,54 Z" fill="#D97706" />
          <path d="M 25,20 Q 45,40 35,65" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.8" />
        </svg>
      ),
    },
    {
      id: "lotus_lake",
      motifId: "lotus",
      title: "Sen Hồng Cung Đình",
      desc: "Thanh tịnh thuần khiết",
      bgGradient: "from-pink-950 to-emerald-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#14532D" />
          <path d="M 40,22 C 34,34 32,50 40,58 C 48,50 46,34 40,22 Z" fill="#F43F5E" />
          <path d="M 32,32 C 24,42 28,52 40,58 C 30,52 28,42 32,32 Z" fill="#FB7185" />
          <path d="M 48,32 C 56,42 52,52 40,58 C 50,52 52,42 48,32 Z" fill="#FB7185" />
          <circle cx="40" cy="54" r="3" fill="#FDE047" />
        </svg>
      ),
    },
    {
      id: "tu_quy_brocade",
      motifId: "tu_quy",
      title: "Tứ Quý Cổ Phong",
      desc: "Tùng - Cúc - Trúc - Mai",
      bgGradient: "from-emerald-950 to-stone-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#1E293B" />
          <path d="M 30,30 L 40,16 L 50,30 Z" fill="#10B981" />
          <circle cx="30" cy="50" r="8" fill="#F59E0B" />
          <line x1="50" y1="36" x2="50" y2="60" stroke="#059669" strokeWidth="4" />
          <circle cx="50" cy="45" r="4" fill="#6EE7B7" />
        </svg>
      ),
    },
    {
      id: "sword_legend",
      motifId: "sword_legend",
      title: "Thánh Kiếm Hoàng Gia",
      desc: "Gươm báu Thuận Thiên",
      bgGradient: "from-sky-950 to-amber-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#0F172A" />
          <line x1="40" y1="14" x2="40" y2="66" stroke="#38BDF8" strokeWidth="8" opacity="0.3" />
          <polygon points="38,20 42,20 42,62 40,68 38,62" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <line x1="40" y1="20" x2="40" y2="65" stroke="#F59E0B" strokeWidth="1.5" />
          <path d="M 30,24 C 36,20 44,20 50,24 L 46,27 L 34,27 Z" fill="#F59E0B" />
          <circle cx="40" cy="25" r="2" fill="#DC2626" />
          <circle cx="40" cy="14" r="3.5" fill="#FBBF24" />
        </svg>
      ),
    },
    {
      id: "pine_bamboo",
      motifId: "pine_bamboo",
      title: "Tùng Bách & Trúc Xanh",
      desc: "Trường tồn khí tiết",
      bgGradient: "from-emerald-950 to-teal-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#064E3B" />
          <line x1="32" y1="18" x2="32" y2="65" stroke="#34D399" strokeWidth="3" />
          <circle cx="32" cy="35" r="2" fill="#FDE047" />
          <circle cx="32" cy="50" r="2" fill="#FDE047" />
          <path d="M 32,35 Q 22,28 16,35" stroke="#10B981" strokeWidth="2" fill="none" />
          <path d="M 32,50 Q 42,42 48,48" stroke="#10B981" strokeWidth="2" fill="none" />
          <path d="M 46,20 C 58,25 58,40 44,45 C 56,50 54,65 42,65" stroke="#78350F" strokeWidth="3" fill="none" />
          <ellipse cx="50" cy="28" rx="8" ry="4" fill="#059669" />
          <ellipse cx="48" cy="48" rx="10" ry="5" fill="#047857" />
        </svg>
      ),
    },
    {
      id: "sticker_cyber",
      stickerId: "cyber_badge",
      title: "Badge Cyber Phục",
      desc: "Huy hiệu tương lai Y2K",
      bgGradient: "from-cyan-950 to-purple-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#0F172A" />
          <polygon points="40,18 60,30 60,54 40,66 20,54 20,30" fill="none" stroke="#06B6D4" strokeWidth="3" />
          <circle cx="40" cy="42" r="8" fill="#EC4899" />
          <line x1="28" y1="42" x2="52" y2="42" stroke="#38BDF8" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "sticker_star",
      stickerId: "genz_star",
      title: "Ngôi Sao Chrome",
      desc: "Ánh kim streetwear",
      bgGradient: "from-stone-900 to-amber-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#1C1917" />
          <path d="M 40,18 L 45,34 L 62,35 L 48,46 L 53,62 L 40,52 L 27,62 L 32,46 L 18,35 L 35,34 Z" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "sticker_viet",
      stickerId: "viet_tag",
      title: "Tag Cổ Phục VN",
      desc: "Nhãn dệt streetwear",
      bgGradient: "from-red-950 to-stone-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#7F1D1D" />
          <rect x="22" y="30" width="36" height="20" rx="3" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
          <text x="40" y="44" fill="#FEF08A" fontSize="10" fontWeight="bold" textAnchor="middle">VN REMIX</text>
        </svg>
      ),
    },
    {
      id: "sticker_lightning",
      stickerId: "lightning_pin",
      title: "Pin Tia Chớp",
      desc: "Ghim neon punk",
      bgGradient: "from-yellow-950 to-stone-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#18181B" />
          <polygon points="44,18 26,42 38,42 34,62 52,38 40,38" fill="#FACC15" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "sticker_smile",
      stickerId: "retro_smile",
      title: "Pixel Smile Gen Z",
      desc: "Biểu cảm vui nhộn",
      bgGradient: "from-amber-950 to-stone-900",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#F59E0B" />
          <circle cx="32" cy="34" r="4" fill="#1C1917" />
          <circle cx="48" cy="34" r="4" fill="#1C1917" />
          <path d="M 28,48 Q 40,60 52,48" stroke="#1C1917" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "sticker_barcode",
      stickerId: "barcode_tag",
      title: "Barcode Techwear",
      desc: "Mã vạch cá tính",
      bgGradient: "from-stone-900 to-stone-950",
      svg: (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="36" fill="#09090B" />
          <rect x="22" y="26" width="36" height="28" rx="2" fill="#FFFFFF" />
          <g fill="#000000">
            <rect x="26" y="30" width="2" height="18" />
            <rect x="30" y="30" width="3" height="18" />
            <rect x="35" y="30" width="1" height="18" />
            <rect x="38" y="30" width="4" height="18" />
            <rect x="44" y="30" width="2" height="18" />
            <rect x="48" y="30" width="3" height="18" />
            <rect x="53" y="30" width="1" height="18" />
          </g>
        </svg>
      ),
    },
  ];

  // Visual Accessories with card styling
  const visualAccessories = [
    {
      id: "head_khan_dong_01",
      name: "Khăn Đóng Hoàng Gia",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-[#D97706]">
          <path d="M 8,24 C 8,14 32,14 32,24 C 32,28 8,28 8,24 Z" fill="#1E1B4B" stroke="#D97706" strokeWidth="1.5" />
          <line x1="8" y1="21" x2="32" y2="21" stroke="#D97706" strokeWidth="1" />
          <circle cx="20" cy="18" r="2" fill="#F59E0B" />
        </svg>
      ),
    },
    {
      id: "head_khan_mo_qua_01",
      name: "Khăn Mỏ Quạ Bắc Bộ",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-stone-900">
          <path d="M 8,22 Q 20,8 32,22 Q 20,32 8,22 Z" fill="#18181B" stroke="#3F3F46" strokeWidth="1.2" />
          <path d="M 20,10 L 20,28" stroke="#52525B" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: "head_non_quai_thao_01",
      name: "Nón Quai Thao",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-amber-600">
          <ellipse cx="20" cy="20" rx="15" ry="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="20" cy="18" r="5" fill="#FDE68A" />
          <path d="M 12,22 Q 20,34 28,22" fill="none" stroke="#DC2626" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "head_tram_cai_01",
      name: "Trâm Cài Tóc Ngọc",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-amber-500">
          <line x1="10" y1="30" x2="28" y2="12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="12" r="5" fill="#10B981" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="28" cy="12" r="2" fill="#EF4444" />
        </svg>
      ),
    },
    {
      id: "acc_quat_lua_01",
      name: "Quạt Lụa Đào",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-[#E07A5F]">
          <path d="M 6,28 C 10,12 30,12 34,28 L 20,34 Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1.2" />
          <line x1="20" y1="34" x2="12" y2="20" stroke="#BE123C" strokeWidth="0.8" />
          <line x1="20" y1="34" x2="20" y2="16" stroke="#BE123C" strokeWidth="0.8" />
          <line x1="20" y1="34" x2="28" y2="20" stroke="#BE123C" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      id: "acc_ngoc_boi_01",
      name: "Ngọc Bội Thắt Eo",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-[#047857]">
          <circle cx="20" cy="14" r="6" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
          <circle cx="20" cy="14" r="2" fill="#FFFFFF" />
          <line x1="20" y1="20" x2="20" y2="34" stroke="#DC2626" strokeWidth="2" strokeDasharray="2 1" />
          <path d="M 18,34 L 22,34 L 21,38 L 19,38 Z" fill="#DC2626" />
        </svg>
      ),
    },
    {
      id: "acc_kieng_bac_01",
      name: "Kiềng Bạc Chạm Sen",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-stone-300">
          <ellipse cx="20" cy="18" rx="12" ry="7" fill="none" stroke="#CBD5E1" strokeWidth="3" />
          <circle cx="20" cy="25" r="2.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: "acc_tote_canvas_01",
      name: "Túi Tote Canvas",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-stone-700">
          <rect x="12" y="16" width="16" height="18" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.2" />
          <path d="M 16,16 L 16,10 Q 20,7 24,10 L 24,16" fill="none" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="20" cy="24" r="3" fill="#E07A5F" />
        </svg>
      ),
    },
    {
      id: "shoe_hai_theu_01",
      name: "Hài Thêu Mũi Cong",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-[#E07A5F]">
          <path d="M 8,26 Q 16,28 28,26 Q 34,22 34,16 Q 30,22 24,23 L 8,23 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <circle cx="30" cy="18" r="1.5" fill="#DC2626" />
        </svg>
      ),
    },
    {
      id: "shoe_guoc_moc_01",
      name: "Guốc Mộc Quai Lụa",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-amber-700">
          <path d="M 8,24 L 32,24 L 30,28 L 10,28 Z" fill="#B45309" />
          <path d="M 14,24 Q 20,16 26,24" fill="none" stroke="#DC2626" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      id: "shoe_sneaker_white_01",
      name: "Sneaker Trắng Gen Z",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-stone-600">
          <path d="M 8,26 L 32,26 Q 34,20 28,18 L 14,20 L 8,22 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="8" y1="26" x2="32" y2="26" stroke="#475569" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "shoe_boot_combat_01",
      name: "Combat Boots",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-stone-900">
          <path d="M 12,12 L 20,12 L 20,20 L 30,22 L 30,27 L 12,27 Z" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: "shoe_loafer_chunky_01",
      name: "Loafer Chunky",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-stone-900">
          <path d="M 10,24 L 30,24 L 32,28 L 8,28 Z" fill="#0F172A" />
          <circle cx="20" cy="22" r="2.5" fill="#F59E0B" />
        </svg>
      ),
    },
    {
      id: "head_kinh_ram_01",
      name: "Kính Râm Y2K",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-cyan-600">
          <rect x="10" y="18" width="8" height="6" rx="2" fill="#0F172A" stroke="#06B6D4" strokeWidth="1.2" />
          <rect x="22" y="18" width="8" height="6" rx="2" fill="#0F172A" stroke="#06B6D4" strokeWidth="1.2" />
          <line x1="18" y1="20" x2="22" y2="20" stroke="#EC4899" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "head_cap_01",
      name: "Mũ Streetwear",
      iconSvg: (
        <svg viewBox="0 0 40 40" className="w-7 h-7 text-stone-800">
          <path d="M 12,22 C 12,14 26,14 26,22 Z" fill="#27272A" />
          <path d="M 22,22 L 34,22" stroke="#27272A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  // Dynamic heritage info based on current garment and gender
  const getHeritageInfo = () => {
    if (garmentId === "garment_nhatbinh_01") {
      return {
        name: modelGender === "male" ? "Áo Đại Cổ Cung Đình" : "Áo Nhật Bình Cung Đình",
        dynasty: modelGender === "male" ? "Triều Nguyễn • Dành cho Nam" : "Triều Nguyễn • Hoàng triều Nhà Nguyễn",
        desc: modelGender === "male"
          ? "Áo Đại Cổ là trang phục lễ nghi truyền thống trang trọng của nam giới triều Nguyễn, thể hiện sự chững chạc và chuẩn mực điển chế hoàng triều."
          : "Áo Nhật Bình là trang phục cung đình của bậc phi tần, tượng trưng cho sự cao quý, trang nhã và chuẩn mực lễ nghi triều Nguyễn.",
      };
    }
    if (garmentId === "garment_nguthan_01") {
      return {
        name: "Áo Ngũ Thân Lập Lĩnh",
        dynasty: modelGender === "male" ? "Triều Nguyễn • Dành cho Nam" : "Triều Nguyễn • Hoàng triều",
        desc: modelGender === "male"
          ? "Áo Ngũ Thân là trang phục cung đình dành cho nam giới, tượng trưng cho phẩm cách, lễ nghi và ngũ thường. Phiên bản Lập Lĩnh mang hơi thở đương đại, giữ tinh thần truyền thống nhưng vẫn trẻ trung, phù hợp Gen Z."
          : "Áo Ngũ Thân là biểu tượng y phục truyền thống với cấu trúc 5 thân, khuy cài bên phải tượng trưng cho Ngũ Thường và đạo lý làm người.",
      };
    }
    if (garmentId === "garment_aodai_01") {
      return {
        name: modelGender === "male" ? "Áo Gấm Cách Tân" : "Áo Dài Truyền Thống",
        dynasty: modelGender === "male" ? "Quan lại & Lễ nghi" : "Cận đại & Đương đại",
        desc: "Quốc phục Việt Nam thướt tha với 2 tà trước sau buông rủ thanh lịch, tôn vinh nét đẹp uyển chuyển của người Việt qua nhiều thế hệ.",
      };
    }
    return {
      name: modelGender === "male" ? "Y Phục Liền Anh Quan Họ" : "Áo Tứ Thân Bắc Bộ",
      dynasty: modelGender === "male" ? "Dân gian Bắc Bộ • Liền Anh Quan Họ" : "Dân gian Bắc Bộ (Thời Lê - Nguyễn)",
      desc: modelGender === "male"
        ? "Trang phục truyền thống của các liền anh quan họ Bắc Bộ với áo năm thân mộc mạc, dáng đứng nho nhã, hào hoa và chuẩn mực phong thái thanh lịch."
        : "Trang phục dân gian mộc mạc mà duyên dáng của phụ nữ đồng bằng Bắc Bộ, gắn liền với hát Quan họ và các lễ hội mùa xuân.",
    };
  };
  const heritageInfo = getHeritageInfo();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col rounded-3xl select-none overflow-hidden"
    >
      {/* ===================================================================
          1. STAGE BACKGROUND: IMPERIAL VIETNAMESE COURTYARD
      ==================================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out pointer-events-none"
        style={{
          backgroundImage: "url('/images/heritage_stage_bg.jpg')",
        }}
      >
        {/* Soft atmospheric radial gradient to focus on the center avatar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-[circle_at_50%_45%] from-transparent via-stone-900/10 to-stone-950/30 pointer-events-none" />
      </div>

      {/* ===================================================================
          2. FLOATING TOP TOOLBAR: GROUPED PILL CARDS
      ==================================================================== */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between gap-2.5 pointer-events-none">
        {/* GROUP 1: GENDER PILL (NỮ | NAM) */}
        <div className="flex items-center p-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-md pointer-events-auto">
          <button
            onClick={() => setModelGender("female")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              modelGender === "female"
                ? "bg-[#E07A5F] text-white shadow-xs font-black"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
            }`}
          >
            <span>🌸</span>
            <span>Nữ</span>
          </button>
          <button
            onClick={() => setModelGender("male")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              modelGender === "male"
                ? "bg-[#E07A5F] text-white shadow-xs font-black"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
            }`}
          >
            <span>⚡</span>
            <span>Nam</span>
          </button>
        </div>

        {/* GROUP 2: VIEW ANGLE PILL (TRƯỚC | NGHIÊNG | LƯNG) */}
        <div className="flex items-center p-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-md pointer-events-auto">
          <button
            onClick={() => setViewAngle("front")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              viewAngle === "front"
                ? "bg-[#E07A5F] text-white shadow-xs font-black"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
            }`}
            title="Góc chính diện"
          >
            <span>👁️</span>
            <span>Trước</span>
          </button>
          <button
            onClick={() => setViewAngle("side")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              viewAngle === "side"
                ? "bg-[#E07A5F] text-white shadow-xs font-black"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
            }`}
            title="Góc nghiêng 3/4"
          >
            <span>📐</span>
            <span>Nghiêng</span>
          </button>
          <button
            onClick={() => setViewAngle("back")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              viewAngle === "back"
                ? "bg-[#E07A5F] text-white shadow-xs font-black"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
            }`}
            title="Góc sau lưng"
          >
            <span>🔄</span>
            <span>Lưng</span>
          </button>
        </div>

        {/* GROUP 3: ACTIONS & UTILITIES PILL */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-md pointer-events-auto">
          {/* X-Ray Pill (Jade accent) */}
          <button
            onClick={() => setShowXRay(!showXRay)}
            className={`px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showXRay
                ? "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] shadow-xs"
                : "bg-white text-stone-600 hover:text-stone-900"
            }`}
            title="Bật/Tắt Di Sản X-Ray"
          >
            <Scan className="w-3.5 h-3.5 text-[#047857]" />
            <span className="hidden xl:inline">Di Sản X-Ray</span>
          </button>

          {/* Lookbook Button */}
          {onOpenLookbook && (
            <button
              onClick={onOpenLookbook}
              className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 flex items-center gap-1 transition-all cursor-pointer"
              title="Xuất Lookbook thời trang"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden xl:inline">Lookbook</span>
            </button>
          )}

          {/* Compare Button */}
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="px-2 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 flex items-center gap-1 transition-all cursor-pointer"
              title="So sánh A/B"
            >
              <GitCompare className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden xl:inline">So sánh A/B</span>
            </button>
          )}

          {/* Zoom In */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.5))}
            className="p-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.8))}
            className="p-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ===================================================================
          3. LEFT VERTICAL PREVIEW RAIL (FRONT, SIDE, BACK THUMBNAILS)
      ==================================================================== */}
      <div className="absolute left-4 top-24 z-20 flex flex-col items-center gap-2.5 pointer-events-auto">
        {[
          { angle: "front" as ViewAngle, label: "Trước" },
          { angle: "side" as ViewAngle, label: "Nghiêng" },
          { angle: "back" as ViewAngle, label: "Lưng" },
        ].map((item) => {
          const isActive = viewAngle === item.angle;
          return (
            <button
              key={item.angle}
              onClick={() => setViewAngle(item.angle)}
              className={`w-13 h-16 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-md shadow-md p-0.5 transition-all duration-200 cursor-pointer relative group ${
                isActive
                  ? "ring-2 ring-[#E07A5F] shadow-lg shadow-[#E07A5F]/20 scale-105"
                  : "border border-white/80 hover:scale-102 hover:border-[#E07A5F]/50 opacity-85 hover:opacity-100"
              }`}
              title={`Góc nhìn ${item.label}`}
            >
              <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F5] relative flex items-center justify-center p-0.5">
                <div className="w-full h-full flex items-center justify-center pointer-events-none scale-85">
                  <AnimeFashionAvatar
                    gender={modelGender}
                    garmentId={garmentId}
                    outfitConfig={outfitConfig}
                    showXRay={false}
                    selectedTargetVisual={null}
                    onSelectHotspot={() => {}}
                    visualState={visualState}
                    viewAngle={item.angle}
                    idPrefix={`rail_${item.angle}`}
                  />
                </div>
              </div>
              {isActive && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#E07A5F] ring-1 ring-white" />
              )}
            </button>
          );
        })}

        {/* Down Chevron Indicator */}
        <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200/60 flex items-center justify-center text-stone-500 shadow-2xs">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ===================================================================
          4. TOP-RIGHT HERITAGE INFO CARD
      ==================================================================== */}
      <div className="absolute top-20 right-4 z-20 max-w-[270px] p-3.5 rounded-2xl bg-white/92 backdrop-blur-md border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] pointer-events-auto">
        <div className="flex items-start justify-between gap-1">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-stone-900 leading-tight">
                {heritageInfo.name}
              </h3>
              <Info className="w-3 h-3 text-stone-400" />
            </div>
            <p className="text-[10px] text-stone-500 font-medium mt-0.5">
              {heritageInfo.dynasty}
            </p>
          </div>
          {/* Traditional Rosette Stamp */}
          <div className="w-5 h-5 text-[#E07A5F] shrink-0 opacity-80">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3" fill="#E07A5F" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse key={deg} cx="12" cy="5" rx="2" ry="4" transform={`rotate(${deg} 12 12)`} />
              ))}
            </svg>
          </div>
        </div>

        <p className="text-[10.5px] text-stone-600 leading-relaxed mt-2 line-clamp-3">
          {heritageInfo.desc}
        </p>

        <button
          onClick={() => setShowHeritageModal(true)}
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#E07A5F] hover:text-[#d3694e] transition-colors cursor-pointer"
        >
          <span>Tìm hiểu thêm</span>
          <span>→</span>
        </button>
      </div>

      {/* ===================================================================
          5. CENTER STAGE: LARGE RUNWAY AVATAR & HOTSPOT CALLOUTS
      ==================================================================== */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-2 pt-16 pb-28 overflow-hidden">
        {/* The Anime Model Container */}
        <div
          className="relative h-full max-h-full aspect-[460/790] mx-auto flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <AnimeFashionAvatar
            gender={modelGender}
            garmentId={garmentId}
            outfitConfig={outfitConfig}
            showXRay={showXRay}
            selectedTargetVisual={selectedTargetVisual}
            onSelectHotspot={onSelectHotspot}
            visualState={visualState}
            viewAngle={viewAngle}
            idPrefix="main_stage"
          />

          {/* ===================================================================
              6. CULTURAL X-RAY HOTSPOT CALLOUT CARDS (EXPANDED OUTWARD WITH LEADER LINES)
          ==================================================================== */}
          {showXRay && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Slender Connector Lines (Đường nối mảnh chỉ vào từng điểm đặc sắc) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="hotspotLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#E07A5F" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Line 1: Cổ áo (Left Top) -> Pin at (48%, 20%) to (-4%, 18%) */}
                <path
                  d="M 48 20 L 22 18 L -4 18"
                  fill="none"
                  stroke="#E07A5F"
                  strokeWidth="1.2"
                  strokeDasharray="2 1.5"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#hotspotLineGlow)"
                />

                {/* Line 2: Tay áo rộng (Left Middle) -> Pin at (24%, 36%) to (-4%, 38%) */}
                <path
                  d="M 24 36 L 10 38 L -4 38"
                  fill="none"
                  stroke="#E07A5F"
                  strokeWidth="1.2"
                  strokeDasharray="2 1.5"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#hotspotLineGlow)"
                />

                {/* Line 3: Họa tiết thêu (Right Middle) -> Pin at (52%, 42%) to (104%, 44%) */}
                <path
                  d="M 52 42 L 78 44 L 104 44"
                  fill="none"
                  stroke="#E07A5F"
                  strokeWidth="1.2"
                  strokeDasharray="2 1.5"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#hotspotLineGlow)"
                />

                {/* Line 4: Thân tà (Right Lower) -> Pin at (52%, 70%) to (104%, 68%) */}
                <path
                  d="M 52 70 L 78 68 L 104 68"
                  fill="none"
                  stroke="#E07A5F"
                  strokeWidth="1.2"
                  strokeDasharray="2 1.5"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#hotspotLineGlow)"
                />
              </svg>

              {/* HOTSPOT PINS (ĐIỂM NEO PHÁT SÁNG TRÊN ÁO) */}
              {/* Pin 1: Cổ áo */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20"
                style={{ left: "48%", top: "20%" }}
                onClick={() => onSelectHotspot("collar", ["ANCHOR_01", "ANCHOR_NB_01", "ANCHOR_AD_01"])}
                title="Xem chi tiết: Cổ áo"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-5 h-5 rounded-full bg-[#E07A5F]/35 animate-ping pointer-events-none" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white shadow-md flex items-center justify-center group-hover:scale-125 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>
              </div>

              {/* Pin 2: Tay áo rộng */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20"
                style={{ left: "24%", top: "36%" }}
                onClick={() => onSelectHotspot("torso", ["ANCHOR_NB_02", "ANCHOR_02"])}
                title="Xem chi tiết: Tay áo rộng"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-5 h-5 rounded-full bg-[#E07A5F]/35 animate-ping pointer-events-none" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white shadow-md flex items-center justify-center group-hover:scale-125 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>
              </div>

              {/* Pin 3: Họa tiết thêu */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20"
                style={{ left: "52%", top: "42%" }}
                onClick={() => onSelectHotspot("torso", ["ANCHOR_NB_01", "ANCHOR_03"])}
                title="Xem chi tiết: Họa tiết thêu"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-5 h-5 rounded-full bg-[#E07A5F]/35 animate-ping pointer-events-none" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white shadow-md flex items-center justify-center group-hover:scale-125 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>
              </div>

              {/* Pin 4: Thân tà */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20"
                style={{ left: "52%", top: "70%" }}
                onClick={() => onSelectHotspot("torso", ["ANCHOR_02", "ANCHOR_03", "ANCHOR_TT_01"])}
                title="Xem chi tiết: Thân tà"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-5 h-5 rounded-full bg-[#E07A5F]/35 animate-ping pointer-events-none" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white shadow-md flex items-center justify-center group-hover:scale-125 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>
              </div>

              {/* CALLOUT CARDS (DYNAMIC THEO BỘ ĐỒ VÀ THEO TỪNG PROMPT) */}
              {/* Card 1: CỔ ÁO (Bên Trái Trên) */}
              <div
                className="absolute right-[104%] top-[14%] pointer-events-auto transform transition-all hover:scale-105 cursor-pointer z-20 w-44 sm:w-52"
                onClick={() => onSelectHotspot("collar", ["ANCHOR_01", "ANCHOR_NB_01", "ANCHOR_AD_01"])}
                title={calloutAnnotations.collar.subtitle}
              >
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E07A5F]/35 shadow-md hover:shadow-lg hover:border-[#E07A5F] transition-all group">
                  <div className="text-right min-w-0 flex-1">
                    <div className="text-[11px] font-black text-stone-900 leading-tight truncate">
                      {calloutAnnotations.collar.title}
                    </div>
                    <div className="text-[9.5px] text-stone-600 font-medium line-clamp-2 leading-tight mt-0.5">
                      {calloutAnnotations.collar.subtitle}
                    </div>
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                </div>
              </div>

              {/* Card 2: TAY ÁO (Bên Trái Giữa) */}
              <div
                className="absolute right-[104%] top-[34%] pointer-events-auto transform transition-all hover:scale-105 cursor-pointer z-20 w-44 sm:w-52"
                onClick={() => onSelectHotspot("torso", ["ANCHOR_NB_02", "ANCHOR_02"])}
                title={calloutAnnotations.sleeves.subtitle}
              >
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E07A5F]/35 shadow-md hover:shadow-lg hover:border-[#E07A5F] transition-all group">
                  <div className="text-right min-w-0 flex-1">
                    <div className="text-[11px] font-black text-stone-900 leading-tight truncate">
                      {calloutAnnotations.sleeves.title}
                    </div>
                    <div className="text-[9.5px] text-stone-600 font-medium line-clamp-2 leading-tight mt-0.5">
                      {calloutAnnotations.sleeves.subtitle}
                    </div>
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                </div>
              </div>

              {/* Card 3: HỌA TIẾT THÊU (Bên Phải Giữa) */}
              <div
                className="absolute left-[104%] top-[40%] pointer-events-auto transform transition-all hover:scale-105 cursor-pointer z-20 w-44 sm:w-52"
                onClick={() => onSelectHotspot("torso", ["ANCHOR_NB_01", "ANCHOR_03"])}
                title={calloutAnnotations.embroidery.subtitle}
              >
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E07A5F]/35 shadow-md hover:shadow-lg hover:border-[#E07A5F] transition-all group">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-[11px] font-black text-stone-900 leading-tight truncate">
                      {calloutAnnotations.embroidery.title}
                    </div>
                    <div className="text-[9.5px] text-stone-600 font-medium line-clamp-2 leading-tight mt-0.5">
                      {calloutAnnotations.embroidery.subtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: THÂN TÀ / THÂN ÁO (Bên Phải Dưới) */}
              <div
                className="absolute left-[104%] top-[64%] pointer-events-auto transform transition-all hover:scale-105 cursor-pointer z-20 w-44 sm:w-52"
                onClick={() => onSelectHotspot("torso", ["ANCHOR_02", "ANCHOR_03", "ANCHOR_TT_01"])}
                title={calloutAnnotations.body.subtitle}
              >
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E07A5F]/35 shadow-md hover:shadow-lg hover:border-[#E07A5F] transition-all group">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E07A5F] border-2 border-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-[11px] font-black text-stone-900 leading-tight truncate">
                      {calloutAnnotations.body.title}
                    </div>
                    <div className="text-[9.5px] text-stone-600 font-medium line-clamp-2 leading-tight mt-0.5">
                      {calloutAnnotations.body.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          8. FLOATING BOTTOM CUSTOMIZATION DOCK
      ==================================================================== */}
      <div className="absolute bottom-3 inset-x-4 z-25 p-2.5 rounded-[22px] bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] pointer-events-auto">
        {/* Dock Header Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-4 text-xs font-bold">
            {/* Tab 1: Bảng màu cổ phục */}
            <button
              onClick={() => setActiveBottomTab("palette")}
              className={`flex items-center gap-1.5 pb-1 relative transition-colors cursor-pointer ${
                activeBottomTab === "palette"
                  ? "text-[#E07A5F] font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Bảng Màu Cổ Phục</span>
              {activeBottomTab === "palette" && (
                <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-[#E07A5F] rounded-full" />
              )}
            </button>

            {/* Tab 2: Họa tiết & Sticker */}
            <button
              onClick={() => setActiveBottomTab("motifs")}
              className={`flex items-center gap-1.5 pb-1 relative transition-colors cursor-pointer ${
                activeBottomTab === "motifs"
                  ? "text-[#E07A5F] font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Họa Tiết & Sticker {motifs.length + stickers.length > 0 ? `(${motifs.length + stickers.length})` : ""}</span>
              {activeBottomTab === "motifs" && (
                <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-[#E07A5F] rounded-full" />
              )}
            </button>

            {/* Tab 3: Phụ kiện phối */}
            <button
              onClick={() => setActiveBottomTab("accessories")}
              className={`flex items-center gap-1.5 pb-1 relative transition-colors cursor-pointer ${
                activeBottomTab === "accessories"
                  ? "text-[#E07A5F] font-black"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Phụ Kiện Phối ({accessories.length})</span>
              {activeBottomTab === "accessories" && (
                <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-[#E07A5F] rounded-full" />
              )}
            </button>
          </div>

          {/* Navigation arrow buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleDockScroll("left")}
              className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Cuộn sang trái"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDockScroll("right")}
              className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Cuộn sang phải"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dock Content Scroll Container */}
        <div
          ref={scrollDockRef}
          className="flex items-center gap-2.5 pt-2.5 overflow-x-auto scrollbar-none scroll-smooth"
        >
          {/* TAB 1: CIRCULAR COLOR SWATCHES */}
          {activeBottomTab === "palette" && (
            <div className="flex items-center gap-3 py-1">
              {colorPresets.map((preset) => {
                const isSelected = bodyColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onUpdateColors?.({
                        body: preset.hex,
                        collar: preset.collar,
                        pants: preset.pants,
                        inner: preset.inner,
                        belt: preset.belt,
                      });
                    }}
                    className={`group relative flex flex-col items-center gap-1 transition-transform cursor-pointer ${
                      isSelected ? "scale-110" : "hover:scale-105"
                    }`}
                    title={preset.name}
                  >
                    <div
                      className={`w-9 h-9 rounded-full shadow-sm transition-all flex items-center justify-center ${
                        isSelected
                          ? "ring-2 ring-[#E07A5F] ring-offset-2 ring-offset-white shadow-md"
                          : "border border-stone-200/80 group-hover:border-stone-400"
                      }`}
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 stroke-[3] ${
                            preset.hex === "#FFFFFF" || preset.hex === "#FAF8F5"
                              ? "text-stone-900"
                              : "text-white"
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: VISUAL MOTIF & STICKER CARDS */}
          {activeBottomTab === "motifs" && (
            <div className="flex items-center gap-2.5 py-1">
              {visualMotifs.map((item) => {
                const isSelected = item.motifId
                  ? motifs.includes(item.motifId)
                  : item.stickerId
                  ? stickers.includes(item.stickerId)
                  : false;
                const handleToggle = () => {
                  if (item.motifId) onToggleMotif?.(item.motifId);
                  else if (item.stickerId) onToggleSticker?.(item.stickerId);
                };
                return (
                  <button
                    key={item.id}
                    onClick={handleToggle}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer text-left shrink-0 ${
                      isSelected
                        ? "bg-[#E07A5F]/10 border-[#E07A5F] ring-1 ring-[#E07A5F]/40 shadow-xs"
                        : "bg-stone-50 border-stone-200/80 hover:bg-stone-100"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-900 shrink-0 shadow-2xs">
                      {item.svg}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 leading-tight">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#E07A5F] flex items-center justify-center text-white ml-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 3: VISUAL ACCESSORY CARDS */}
          {activeBottomTab === "accessories" && (
            <div className="flex items-center gap-2 py-1">
              {visualAccessories.map((acc) => {
                const isSelected = accessories.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    onClick={() => onToggleAccessory?.(acc.id)}
                    className={`flex flex-col items-center justify-center w-18 h-18 p-1.5 rounded-xl border transition-all cursor-pointer text-center shrink-0 relative ${
                      isSelected
                        ? "bg-[#E07A5F]/10 border-[#E07A5F] ring-1 ring-[#E07A5F]/40 shadow-xs"
                        : "bg-stone-50 border-stone-200/80 hover:bg-stone-100"
                    }`}
                    title={acc.name}
                  >
                    <div className="w-8 h-8 flex items-center justify-center mb-0.5">
                      {acc.iconSvg}
                    </div>
                    <span className="text-[9.5px] font-bold text-stone-800 leading-tight line-clamp-1 w-full px-0.5">
                      {acc.name.split(" ")[0]}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#E07A5F] flex items-center justify-center text-white">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          HERITAGE MODAL (TÌM HIỂU THÊM)
      ==================================================================== */}
      {showHeritageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-800 relative">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  {heritageInfo.name}
                </h3>
                <p className="text-xs text-[#E07A5F] font-bold mt-0.5">
                  {heritageInfo.dynasty}
                </p>
              </div>
              <button
                onClick={() => setShowHeritageModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mt-4">
              {heritageInfo.desc}
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
              <div className="text-[11px] font-bold text-stone-800 mb-1">
                Điểm Nhận Diện Cốt Lõi:
              </div>
              <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside">
                <li>Cổ áo chuẩn mực theo điển chế triều Nguyễn</li>
                <li>Vạt áo và nếp gấp bảo lưu cấu trúc chuẩn văn hóa</li>
                <li>Họa tiết hoàng gia cách điệu hài hòa với phong cách đương đại</li>
              </ul>
            </div>

            <button
              onClick={() => setShowHeritageModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-[#E07A5F] text-white font-bold text-xs cursor-pointer shadow-md shadow-[#E07A5F]/20"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
