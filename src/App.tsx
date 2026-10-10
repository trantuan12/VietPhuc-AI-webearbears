import React, { useState, useEffect } from "react";
import { useStudio } from "@/hooks/useStudio";
import { Header } from "@/components/shared/Header";
import { ErrorBanner } from "@/components/shared/ErrorBanner";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { ControlPanel } from "@/components/studio/ControlPanel";
import { InteractiveFashionAvatarStudio } from "@/components/studio/InteractiveFashionAvatarStudio";
import { CultureGuardPanel } from "@/components/culture/CultureGuardPanel";
import { LookbookExportModal } from "@/components/studio/LookbookExportModal";
import { CompareModal } from "@/components/studio/CompareModal";
import { HeritageLibraryModal } from "@/components/studio/HeritageLibraryModal";
import { CinematicHeritageIntro } from "@/components/intro/CinematicHeritageIntro";
import { TargetVisual, CulturalAnchor, ApprovedFact } from "@/types/culture";
import { OutfitConfig } from "@/types/studio";

import garmentsData from "@/data/garments.json";
import { filterVerifiedAnchors, filterVerifiedFacts } from "@/services/provenance";

export default function App() {
  const {
    garmentId,
    setGarmentId,
    eventId,
    setEventId,
    remixTier,
    setRemixTier,
    prompt,
    setPrompt,
    pendingAction,
    apiResponse,
    error,
    setError,
    remix,
    repair,
  } = useStudio();

  const [selectedTargetVisual, setSelectedTargetVisual] = useState<TargetVisual | null>(null);
  const [selectedAnchorIds, setSelectedAnchorIds] = useState<string[]>([]);

  // Modals state
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [savedCompareConfig, setSavedCompareConfig] = useState<OutfitConfig | null>(null);

  // Manual interactive overrides (colors, accessories, motifs, stickers)
  const [manualColors, setManualColors] = useState<{ body: string; collar: string; pants?: string; inner?: string; belt?: string } | null>(null);
  const [manualAccessories, setManualAccessories] = useState<string[] | null>(null);
  const [manualMotifs, setManualMotifs] = useState<string[] | null>(null);
  const [manualStickers, setManualStickers] = useState<string[] | null>(null);

  const isPending = pendingAction !== null;
  const isRepairing = pendingAction === "repair";

  // Find active garment
  const garments = garmentsData as any[];
  const currentGarment = garments.find((g) => g.id === garmentId) || garments[0];
  const defaultAnchors: CulturalAnchor[] = filterVerifiedAnchors(currentGarment.anchors);
  const defaultFacts: ApprovedFact[] = filterVerifiedFacts(currentGarment.educational_facts);

  // Reset manual overrides when garmentId or apiResponse changes
  useEffect(() => {
    setManualColors(null);
    setManualAccessories(null);
    setManualMotifs(null);
    setManualStickers(null);
  }, [garmentId, apiResponse]);

  // Outfit config composition
  const baseColors = apiResponse?.outfit_config?.colors || currentGarment.original_visual_config.colors;
  const effectiveColors = manualColors || baseColors;

  const baseAccessories = apiResponse?.outfit_config?.accessories || currentGarment.original_visual_config.default_accessories;
  const effectiveAccessories = manualAccessories || baseAccessories;

  const baseMotifs = apiResponse?.outfit_config?.motifs || [];
  const effectiveMotifs = manualMotifs || baseMotifs;

  const baseStickers = apiResponse?.outfit_config?.stickers || [];
  const effectiveStickers = manualStickers || baseStickers;

  const effectivePattern = apiResponse?.outfit_config?.pattern || "plain";

  const currentOutfitConfig: OutfitConfig = {
    colors: effectiveColors,
    accessories: effectiveAccessories,
    motifs: effectiveMotifs,
    stickers: effectiveStickers,
    pattern: effectivePattern,
  };

  const currentVisualState = apiResponse?.visual_state || {
    collar: "unknown",
    torso: "unknown",
    feet: "unknown",
    head: "unknown",
    bag: "unknown",
  };

  const handleSelectHotspot = (targetVisual: TargetVisual, anchorIds: string[]) => {
    setSelectedTargetVisual(targetVisual);
    setSelectedAnchorIds(anchorIds);
  };

  const handleUpdateColors = (colors: { body: string; collar: string; pants?: string; inner?: string; belt?: string }) => {
    setManualColors(colors);
  };

  const handleToggleAccessory = (accId: string) => {
    const prev = manualAccessories || currentOutfitConfig.accessories;
    if (prev.includes(accId)) {
      setManualAccessories(prev.filter((id) => id !== accId));
    } else {
      setManualAccessories([...prev, accId]);
    }
  };

  const handleToggleMotif = (motifId: string) => {
    const prev = manualMotifs || currentOutfitConfig.motifs || [];
    if (prev.includes(motifId)) {
      setManualMotifs(prev.filter((id) => id !== motifId));
    } else {
      setManualMotifs([...prev, motifId]);
    }
  };

  const handleToggleSticker = (stickerId: string) => {
    const prev = manualStickers || currentOutfitConfig.stickers || [];
    if (prev.includes(stickerId)) {
      setManualStickers(prev.filter((id) => id !== stickerId));
    } else {
      setManualStickers([...prev, stickerId]);
    }
  };

  const handleSaveCurrentAsA = () => {
    setSavedCompareConfig({ ...currentOutfitConfig });
  };

  // Tab state for narrow mobile viewports (< 768px)
  const [mobileTab, setMobileTab] = useState<"avatar" | "controls">("avatar");

  // Right panel tab state
  const [activeRightTab, setActiveRightTab] = useState<"stylist" | "guard">("stylist");
  const [gender, setGender] = useState<"female" | "male">("female");

  // Cinematic Intro state: Studio is default on / and /dashbroad; Intro is shown on /intro or when triggered
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const path = window.location.pathname.toLowerCase();
    if (path === "/intro") {
      return true;
    }
    return false;
  });

  const handleFinishIntro = () => {
    if (typeof window !== "undefined" && window.location.pathname !== "/dashbroad") {
      window.history.pushState({}, "", "/dashbroad");
    }
    setShowIntro(false);
  };

  const handleOpenIntro = () => {
    if (typeof window !== "undefined" && window.location.pathname !== "/intro") {
      window.history.pushState({}, "", "/intro");
    }
    setShowIntro(true);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes("dashbroad") || path.includes("dashboard")) {
        setShowIntro(false);
      } else if (path === "/" || path === "/intro") {
        setShowIntro(true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] relative">
      {/* Cinematic Heritage Intro Overlay */}
      {showIntro && (
        <CinematicHeritageIntro
          onComplete={handleFinishIntro}
          onSkip={handleFinishIntro}
        />
      )}

      {/* Header */}
      <Header
        garmentId={garmentId}
        onSelectGarment={setGarmentId}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenIntro={handleOpenIntro}
      />

      {/* Loading overlay */}
      <LoadingOverlay isLoading={isPending} />

      {/* Error banner */}
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {/* Mobile Tab Switcher (Only visible on narrow mobile screens < 768px) */}
      <div className="flex md:hidden items-center justify-center px-3 py-1.5 bg-white/90 border-b border-stone-200/80 shrink-0">
        <div className="flex p-0.5 bg-stone-100 rounded-xl w-full max-w-xs">
          <button
            onClick={() => setMobileTab("avatar")}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              mobileTab === "avatar"
                ? "bg-white text-[#E07A5F] shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <span>👗 Người Mẫu 2.5D</span>
          </button>
          <button
            onClick={() => setMobileTab("controls")}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              mobileTab === "controls"
                ? "bg-white text-[#E07A5F] shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <span>✨ Bảng Tùy Chọn AI</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: 2-column split layout (Side-by-side on >= 768px md) */}
      <main className="flex-1 min-h-0 max-w-[1780px] w-full mx-auto p-2 sm:p-3 flex flex-col md:flex-row gap-3 h-[calc(100vh-68px)] overflow-hidden">
        {/* KHỐI 1: KHỐI NGƯỜI MẪU CỐ ĐỊNH (58% on md, 62% on lg, 64% on xl) */}
        <div
          className={`w-full md:w-[58%] lg:w-[62%] xl:w-[64%] h-full relative flex-col rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-stone-200/80 shrink-0 ${
            mobileTab === "avatar" ? "flex" : "hidden md:flex"
          }`}
        >
          <InteractiveFashionAvatarStudio
            garmentId={garmentId}
            outfitConfig={currentOutfitConfig}
            visualState={currentVisualState}
            selectedTargetVisual={selectedTargetVisual}
            onSelectHotspot={handleSelectHotspot}
            apiResponse={apiResponse}
            eventId={eventId}
            remixTier={remixTier}
            prompt={prompt}
            gender={gender}
            onGenderChange={setGender}
            onSelectGarment={setGarmentId}
            onOpenLookbook={() => setIsLookbookOpen(true)}
            onOpenCompare={() => setIsCompareOpen(true)}
            onUpdateColors={handleUpdateColors}
            onToggleAccessory={handleToggleAccessory}
            onToggleMotif={handleToggleMotif}
            onToggleSticker={handleToggleSticker}
          />
        </div>

        {/* KHỐI 2: KHỐI TÙY CHỌN & THẨM ĐỊNH ĐỘC LẬP (42% on md, 38% on lg, 36% on xl) */}
        <div
          className={`w-full md:w-[42%] lg:w-[38%] xl:w-[36%] h-full flex-col gap-2.5 overflow-hidden ${
            mobileTab === "controls" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Top Segmented Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-white border border-stone-200/90 shadow-xs shrink-0">
            <button
              onClick={() => setActiveRightTab("stylist")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeRightTab === "stylist"
                  ? "bg-gradient-to-r from-[#E07A5F] to-[#D96B4F] text-white shadow-sm font-black"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
              }`}
            >
              <span>✨ Phối Đồ AI</span>
            </button>

            <button
              onClick={() => setActiveRightTab("guard")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                activeRightTab === "guard"
                  ? "bg-gradient-to-r from-[#E07A5F] to-[#D96B4F] text-white shadow-sm font-black"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
              }`}
            >
              <span className="text-blue-500">🛡️</span>
              <span>Thẩm Định Di Sản</span>
              {apiResponse?.cultural_evaluation?.score?.total != null && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    activeRightTab === "guard"
                      ? "bg-white text-[#E07A5F]"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {apiResponse.cultural_evaluation.score.total}đ
                </span>
              )}
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto pr-0 lg:pr-1 pb-4">
            {activeRightTab === "stylist" ? (
              <ControlPanel
                garmentId={garmentId}
                setGarmentId={setGarmentId}
                eventId={eventId}
                setEventId={setEventId}
                remixTier={remixTier}
                setRemixTier={setRemixTier}
                prompt={prompt}
                setPrompt={setPrompt}
                gender={gender}
                onSubmit={() => {
                  remix(undefined, effectiveColors);
                }}
                isLoading={isPending}
                modelUsed={apiResponse?.execution_status?.model_used}
              />
            ) : (
              <CultureGuardPanel
                apiResponse={apiResponse}
                selectedAnchorIds={selectedAnchorIds}
                isRepairing={isRepairing}
                onRepair={repair}
                defaultAnchors={defaultAnchors}
                defaultFacts={defaultFacts}
              />
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: Export Lookbook Card */}
      <LookbookExportModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        garmentId={garmentId}
        outfitConfig={currentOutfitConfig}
        eventId={eventId}
        remixTier={remixTier}
        apiResponse={apiResponse}
        userPrompt={prompt}
      />

      {/* MODAL 2: A/B Comparison */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        garmentId={garmentId}
        currentConfig={currentOutfitConfig}
        savedConfig={savedCompareConfig}
        onSaveCurrentAsA={handleSaveCurrentAsA}
        currentScore={apiResponse?.cultural_evaluation?.score?.total}
      />

      {/* MODAL 3: Heritage Library */}
      <HeritageLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectGarment={setGarmentId}
        currentGarmentId={garmentId}
      />
    </div>
  );
}
