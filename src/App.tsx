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
import { TargetVisual, CulturalAnchor, ApprovedFact } from "@/types/culture";
import { OutfitConfig } from "@/types/studio";

import garmentsData from "@/data/garments.json" with { type: "json" };
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

  // Right panel tab state
  const [activeRightTab, setActiveRightTab] = useState<"stylist" | "guard">("stylist");
  const [gender, setGender] = useState<"female" | "male">("female");

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#E07A5F]/20 selection:text-[#E07A5F]">
      {/* Header */}
      <Header
        garmentId={garmentId}
        onSelectGarment={setGarmentId}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
      />

      {/* Loading overlay */}
      <LoadingOverlay isLoading={isPending} />

      {/* Error banner */}
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {/* Main Studio Workspace: 2-column split layout (64% Left Studio : 36% Right AI Panel) */}
      <main className="flex-1 min-h-0 max-w-[1780px] w-full mx-auto p-2 sm:p-3 flex flex-col lg:flex-row gap-3.5 h-[calc(100vh-68px)] overflow-hidden">
        {/* KHỐI 1: KHỐI NGƯỜI MẪU CỐ ĐỊNH (64% Width) */}
        <div className="w-full lg:w-[64%] h-full relative flex flex-col rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-stone-200/80 shrink-0">
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

        {/* KHỐI 2: KHỐI TÙY CHỌN & THẨM ĐỊNH ĐỘC LẬP (36% Width) */}
        <div className="w-full lg:w-[36%] h-full flex flex-col gap-2.5 overflow-hidden">
          {/* Top Segmented Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-white border border-stone-200/90 shadow-xs shrink-0">
            <button
              onClick={() => setActiveRightTab("stylist")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeRightTab === "stylist"
                  ? "bg-gradient-to-r from-[#E07A5F] to-[#D96B4F] text-white shadow-sm font-black"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
              }`}
            >
              <span>✨ Phối Đồ AI</span>
            </button>

            <button
              onClick={() => setActiveRightTab("guard")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                activeRightTab === "guard"
                  ? "bg-gradient-to-r from-[#E07A5F] to-[#D96B4F] text-white shadow-sm font-black"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
              }`}
            >
              <span className="text-blue-500">🛡️</span>
              <span>Thẩm Định Di Sản</span>
              {apiResponse?.cultural_evaluation?.score?.total != null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  activeRightTab === "guard"
                    ? "bg-white text-[#E07A5F]"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {apiResponse.cultural_evaluation.score.total}đ
                </span>
              )}
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 lg:overflow-y-auto pr-0 lg:pr-1 pb-4">
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
