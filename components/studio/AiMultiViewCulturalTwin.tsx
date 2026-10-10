import React, { useState, useEffect, useRef } from "react";
import { OutfitConfig, VisualState } from "@/types/studio";
import { TargetVisual, RemixTier } from "@/types/culture";
import { StylistApiResponse } from "@/types/api";
import inventoryData from "@/data/inventory.json" with { type: "json" };
import { InventoryItem } from "@/types/culture";
import {
  Sparkles,
  Eye,
  Scan,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Layers,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Palette,
  Compass,
  Copy,
  Check,
  FileText,
  X,
  Camera,
} from "lucide-react";
import { AiStylingCard } from "@/components/studio/AiStylingCard";
import { CulturalTwinVisualSpec } from "@/services/geminiVisual";
import { ViewAngle, buildGeminiLookbookPrompt } from "@/services/geminiPromptBuilder";

const inventory: InventoryItem[] = inventoryData as InventoryItem[];

interface AiMultiViewCulturalTwinProps {
  outfitConfig: OutfitConfig;
  visualState: VisualState;
  selectedTargetVisual: TargetVisual | null;
  onSelectHotspot: (targetVisual: TargetVisual, anchorIds: string[]) => void;
  apiResponse?: StylistApiResponse | null;
  eventId?: string;
  remixTier?: RemixTier;
}

export const AiMultiViewCulturalTwin: React.FC<AiMultiViewCulturalTwinProps> = ({
  outfitConfig,
  visualState,
  selectedTargetVisual,
  onSelectHotspot,
  apiResponse,
  eventId = "event_grad",
  remixTier = "fusion",
}) => {
  const [currentAngle, setCurrentAngle] = useState<ViewAngle>("front");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showXRay, setShowXRay] = useState<boolean>(true);
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [visualSpec, setVisualSpec] = useState<CulturalTwinVisualSpec | null>(null);
  const [isLoadingVisual, setIsLoadingVisual] = useState<boolean>(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Gemini Lookbook Generation state
  const [generatedImages, setGeneratedImages] = useState<Partial<Record<ViewAngle, string>>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoCycleTimerRef = useRef<any>(null);

  const bodyColor = outfitConfig?.colors?.body || "#1E3A8A";
  const collarColor = outfitConfig?.colors?.collar || "#FFFFFF";
  const accessories = outfitConfig?.accessories || [];

  const currentShoeId = accessories.find((id) => id.startsWith("shoe_"));
  const shoeItem = currentShoeId ? inventory.find((i) => i.id === currentShoeId) : null;

  const hasKhanDong = accessories.includes("head_khan_dong_01");
  const hasCap = accessories.includes("head_cap_01");

  // Generate canonical prompt for current configuration & angle
  const currentPromptData = buildGeminiLookbookPrompt({
    outfitConfig,
    intent: apiResponse?.interpreted_intent,
    eventId,
    remixTier,
    viewAngle: currentAngle,
    userPrompt: apiResponse?.semantic_snapshot?.original_prompt,
  });

  // Fetch Gemini Visual Studio specifications when outfit or response changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingVisual(true);

    fetch("/api/gemini/visual-studio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outfitConfig,
        intent: apiResponse?.interpreted_intent,
        eventId,
        remixTier,
        userPrompt: apiResponse?.semantic_snapshot?.original_prompt,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch visual studio specs");
        return res.json();
      })
      .then((data: CulturalTwinVisualSpec) => {
        if (!isCancelled) {
          setVisualSpec(data);
          setIsLoadingVisual(false);
        }
      })
      .catch((err) => {
        console.warn("Visual studio specs fallback:", err);
        if (!isCancelled) {
          setIsLoadingVisual(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [outfitConfig, apiResponse, eventId, remixTier]);

  // Handle generating image using Gemini Image endpoint
  const handleGenerateLook = async () => {
    setIsGeneratingImage(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/gemini/generate-look", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outfitConfig,
          intent: apiResponse?.interpreted_intent,
          eventId,
          remixTier,
          viewAngle: currentAngle,
          userPrompt: apiResponse?.semantic_snapshot?.original_prompt,
        }),
      });

      const data = await res.json();

      if (data.success && data.imageUrl) {
        setGeneratedImages((prev) => ({
          ...prev,
          [currentAngle]: data.imageUrl,
        }));
        setGenerationError(null);
      } else {
        setGenerationError(
          data.error ||
            "Mô hình tạo ảnh Gemini yêu cầu Paid API Key hoặc quota miễn phí tạm hết. Canonical Prompt bên dưới đã được chuẩn hóa để bạn sao chép hoặc kiểm tra."
        );
      }
    } catch (err: any) {
      setGenerationError(
        "Không thể kết nối đến Gemini Image Generation. Bạn có thể xem và sao chép Canonical Prompt được chuẩn hóa bên dưới."
      );
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPromptData.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Auto-cycle through angles if enabled
  useEffect(() => {
    if (!isAutoCycle) {
      if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
      return;
    }

    const anglesList: ViewAngle[] = ["front", "threeQuarter", "collar", "back", "details"];
    autoCycleTimerRef.current = setInterval(() => {
      setCurrentAngle((prev) => {
        const nextIdx = (anglesList.indexOf(prev) + 1) % anglesList.length;
        return anglesList[nextIdx];
      });
    }, 4500);

    return () => {
      if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
    };
  }, [isAutoCycle]);

  const handleSelectAngle = (angle: ViewAngle) => {
    setCurrentAngle(angle);
    setZoomLevel(1);
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));

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

  // Helper for status icon and color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "safe":
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          color: "border-emerald-500/60 bg-emerald-950/80 text-emerald-300",
          dot: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
        };
      case "caution":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          color: "border-amber-500/60 bg-amber-950/80 text-amber-300",
          dot: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
        };
      case "conflict":
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          color: "border-rose-500/60 bg-rose-950/80 text-rose-300",
          dot: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
        };
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />,
          color: "border-neutral-700 bg-neutral-900/80 text-neutral-300",
          dot: "bg-neutral-400",
        };
    }
  };

  const currentImageUrl = generatedImages[currentAngle];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#141419] via-[#0d0d12] to-[#07070a] border border-neutral-800/80 shadow-2xl overflow-hidden flex flex-col select-none"
    >
      {/* Studio Lighting Background Effects (No fake human SVG) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,rgba(245,158,11,0.08),transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.05),transparent_60%)]" />
      <div className="absolute bottom-0 inset-x-0 h-44 pointer-events-none bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 h-10 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* TOP HEADER BAR: Identity & Status */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Studio Look Brand Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800/90 backdrop-blur-md text-xs font-mono font-medium text-neutral-200 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="tracking-wide">AI CULTURAL LOOK STUDIO</span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-xs font-medium text-amber-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Gemini Visual</span>
          </span>

          <span className="hidden md:inline-flex px-2 py-0.5 rounded-md bg-neutral-800/60 border border-neutral-700/60 text-[10px] text-neutral-400">
            Generated with Gemini
          </span>

          {isLoadingVisual && (
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-neutral-400 animate-pulse">
              <RotateCw className="w-3 h-3 animate-spin" />
              <span>Đang đồng bộ lookbook...</span>
            </span>
          )}
        </div>

        {/* Right: Studio Utility Controls */}
        <div className="flex items-center gap-1 bg-neutral-950/85 border border-neutral-800/90 backdrop-blur-md p-1 rounded-xl shadow-xl pointer-events-auto">
          {/* Prompt Inspector Button */}
          <button
            onClick={() => setShowPromptInspector(true)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white"
            title="Xem Canonical Prompt và Negative Prompt"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Prompt</span>
          </button>

          {/* Toggle X-Ray */}
          <button
            onClick={() => setShowXRay(!showXRay)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              showXRay
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400"
            }`}
            title="Bật/Tắt Cultural X-Ray Hotspots"
          >
            <Scan className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">X-Ray</span>
          </button>

          <div className="w-[1px] h-4 bg-neutral-800 mx-0.5" />

          {/* Zoom controls */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Phóng to chi tiết (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Thu nhỏ (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Auto Cycle Lookbook mode */}
          <button
            onClick={() => setIsAutoCycle(!isAutoCycle)}
            className={`p-1.5 rounded-lg text-[11px] transition-colors ${
              isAutoCycle
                ? "bg-amber-500 text-neutral-950 font-bold"
                : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white"
            }`}
            title={isAutoCycle ? "Dừng luân chuyển góc nhìn" : "Tự động luân chuyển góc nhìn (Lookbook)"}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoCycle ? "animate-spin" : ""}`} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MULTI-VIEW ANGLE TABS: Clean Studio Selector */}
      <div className="absolute top-14 inset-x-3 z-15 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800/90 backdrop-blur-md shadow-xl pointer-events-auto max-w-full overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleSelectAngle("front")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentAngle === "front"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-semibold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Toàn thân</span>
          </button>

          <button
            onClick={() => handleSelectAngle("threeQuarter")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentAngle === "threeQuarter"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-semibold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Nghiêng 3/4</span>
          </button>

          <button
            onClick={() => handleSelectAngle("collar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentAngle === "collar"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-semibold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cổ & Ngũ cúc</span>
          </button>

          <button
            onClick={() => handleSelectAngle("back")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentAngle === "back"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-semibold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vạt & Tà sau</span>
          </button>

          <button
            onClick={() => handleSelectAngle("details")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentAngle === "details"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-semibold shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <span>Giày & Phụ kiện</span>
          </button>
        </div>
      </div>

      {/* CENTER VIEWPORT: HONEST EMPTY / GENERATED STATE (NO FAKE VECTOR MANNEQUIN) */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-4 overflow-hidden">
        {currentImageUrl ? (
          // STATE A: Real Gemini generated lookbook photograph
          <div
            className="relative flex items-center justify-center transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={currentImageUrl}
              alt="Gen Z Áo Ngũ Thân Lookbook"
              className="max-h-[540px] max-w-[420px] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-neutral-800/80"
            />

            {/* Cultural X-Ray Hotspots Overlay on real image */}
            {showXRay && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Hotspot 1: Collar */}
                <div
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: "50%", top: "25%" }}
                >
                  <div
                    onClick={() => onSelectHotspot("collar", ["anchor_collar_standing"])}
                    onMouseEnter={() => setHoveredHotspot("collar")}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className="cursor-pointer group flex items-center justify-center"
                  >
                    <span className="absolute w-7 h-7 rounded-full bg-emerald-500/30 animate-ping" />
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center backdrop-blur-md shadow-lg ${
                        getStatusBadge(visualState.collar).color
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${getStatusBadge(visualState.collar).dot}`} />
                    </span>
                  </div>
                </div>

                {/* Hotspot 2: Torso */}
                <div
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: "56%", top: "42%" }}
                >
                  <div
                    onClick={() => onSelectHotspot("torso", ["anchor_lap_linh_5pan"])}
                    onMouseEnter={() => setHoveredHotspot("torso")}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className="cursor-pointer group flex items-center justify-center"
                  >
                    <span className="absolute w-7 h-7 rounded-full bg-amber-500/30 animate-ping" />
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center backdrop-blur-md shadow-lg ${
                        getStatusBadge(visualState.torso).color
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${getStatusBadge(visualState.torso).dot}`} />
                    </span>
                  </div>
                </div>

                {/* Hotspot 3: Footwear */}
                <div
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: "50%", top: "86%" }}
                >
                  <div
                    onClick={() => onSelectHotspot("feet", [])}
                    onMouseEnter={() => setHoveredHotspot("feet")}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className="cursor-pointer group flex items-center justify-center"
                  >
                    <span className="absolute w-7 h-7 rounded-full bg-sky-500/30 animate-ping" />
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center backdrop-blur-md shadow-lg ${
                        getStatusBadge(visualState.feet).color
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${getStatusBadge(visualState.feet).dot}`} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // STATE B: Clean Honest Editorial Ready/Empty State (NO FAKE HUMAN VECTOR)
          <div className="flex flex-col items-center justify-center max-w-md w-full p-6 sm:p-8 rounded-3xl bg-neutral-950/80 border border-neutral-800/90 shadow-2xl backdrop-blur-xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
              <Camera className="w-7 h-7 text-amber-400" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-neutral-100 tracking-wide">
              Bản phối đã sẵn sàng để được hình dung.
            </h3>

            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Hệ thống AI Cultural Look Studio sẽ sử dụng Gemini Visual để tạo hình ảnh người mẫu Gen Z mặc Việt phục theo phong cách fashion lookbook đương đại.
            </p>

            {/* Quick Styling Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
                Thân: {bodyColor}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
                Cổ: {collarColor}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
                {remixTier.toUpperCase()} TIER
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
              <button
                onClick={handleGenerateLook}
                disabled={isGeneratingImage}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isGeneratingImage ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Đang tạo look bằng Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo look bằng Gemini</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPromptInspector(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Xem Prompt</span>
              </button>
            </div>

            {/* Error or Quota notice if present */}
            {generationError && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left w-full">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-200 leading-snug">
                    {generationError}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM INFO BAR: Creative Director Notes & Color Swatches */}
      <div className="absolute bottom-3 inset-x-3 z-15 flex flex-wrap items-end justify-between gap-2 pointer-events-none">
        {/* Left: Fashion Collection Tag & Fabric Spec */}
        <div className="flex flex-col gap-1 pointer-events-auto max-w-[320px] sm:max-w-[420px]">
          {visualSpec ? (
            <div className="p-2.5 rounded-xl bg-neutral-950/85 border border-neutral-800/90 backdrop-blur-md shadow-xl text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 tracking-wide line-clamp-1">
                  {visualSpec.collectionTitle}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                  {visualSpec.styleVibe}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {visualSpec.angles.find((a) => a.id === currentAngle)?.editorialDescription ||
                  "Bản phối Áo Ngũ Thân Lập Lĩnh tôn vinh vẻ đẹp di sản đương đại của Gen Z."}
              </p>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-md shadow-lg text-left">
              <span className="text-xs font-medium text-amber-300">Áo Ngũ Thân Lập Lĩnh Tay Chẽn</span>
              <span className="text-[11px] text-neutral-400 block">Contemporary Vietnamese Lookbook</span>
            </div>
          )}
        </div>

        {/* Right: Color Swatches Inspection Pill */}
        <div className="flex items-center gap-2 bg-neutral-950/85 border border-neutral-800/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl pointer-events-auto">
          <Palette className="w-3.5 h-3.5 text-neutral-400" />
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-full border border-neutral-700 shadow-inner"
              style={{ backgroundColor: bodyColor }}
              title={`Màu thân áo: ${bodyColor}`}
            />
            <span className="text-[11px] font-mono text-neutral-300 uppercase">{bodyColor}</span>
          </div>

          <div className="w-[1px] h-3.5 bg-neutral-800 mx-1" />

          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-full border border-neutral-700 shadow-inner"
              style={{ backgroundColor: collarColor }}
              title={`Màu cổ áo: ${collarColor}`}
            />
            <span className="text-[11px] font-mono text-neutral-300 uppercase">{collarColor}</span>
          </div>
        </div>
      </div>

      {/* PROMPT INSPECTOR MODAL */}
      {showPromptInspector && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full max-h-[85vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-left">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-neutral-100">
                  Gemini Lookbook Canonical Prompt ({currentAngle.toUpperCase()})
                </h4>
              </div>
              <button
                onClick={() => setShowPromptInspector(false)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Positive Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-neutral-300 uppercase text-[11px]">
                    Canonical Visual Prompt:
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 leading-relaxed font-mono select-all">
                  {currentPromptData.prompt}
                </div>
              </div>

              {/* Negative Prompt */}
              <div>
                <span className="font-semibold text-rose-400 uppercase text-[11px] block mb-1.5">
                  Negative Directions (Chống già / Chống phình / Chống sai văn hóa):
                </span>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-neutral-400 leading-relaxed font-mono">
                  {currentPromptData.negativePrompt}
                </div>
              </div>

              {/* Styling Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-900">
                <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                  <span className="font-semibold text-neutral-400 block text-[10px] uppercase">
                    Người mẫu (Human Model):
                  </span>
                  <p className="text-neutral-300 text-[11px] mt-0.5">
                    {currentPromptData.meta.modelDescription}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                  <span className="font-semibold text-neutral-400 block text-[10px] uppercase">
                    Phom dáng áo (Garment Silhouette):
                  </span>
                  <p className="text-neutral-300 text-[11px] mt-0.5">
                    Thẳng suông, rũ tự nhiên, tay chẽn, không phồng, không balloon.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowPromptInspector(false)}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCKED AI STYLING CARD (OVERLAY TẠI GÓC DƯỚI KHI ĐÃ CÓ KẾT QUẢ AI) */}
      {apiResponse && eventId && remixTier && (
        <AiStylingCard
          apiResponse={apiResponse}
          eventId={eventId}
          remixTier={remixTier}
        />
      )}
    </div>
  );
};
