import React from "react";
import { AnimeFashionAvatar } from "./AnimeFashionAvatar";
import { OutfitConfig, ViewAngle } from "@/types/studio";
import { TargetVisual } from "@/types/culture";

export interface HeritageAvatar25DProps {
  garmentId?: string;
  gender?: "female" | "male";
  viewAngle?: ViewAngle;
  bodyColor?: string;
  showXRay?: boolean;
  selectedHotspot?: string | null;
  onSelectHotspot?: (hotspotId: string) => void;
  [key: string]: any;
}

export const HeritageAvatar25D: React.FC<HeritageAvatar25DProps> = ({
  garmentId = "garment_nhatbinh_01",
  gender = "female",
  viewAngle = "front",
  bodyColor = "#047857",
  showXRay = true,
  selectedHotspot = null,
  onSelectHotspot,
  ...restProps
}) => {
  const outfitConfig: OutfitConfig = {
    colors: {
      body: bodyColor || (garmentId === "garment_nhatbinh_01" ? "#047857" : garmentId === "garment_tuthan_01" ? "#78350F" : garmentId === "garment_aodai_01" ? "#DC2626" : "#1E3A8A"),
      collar: garmentId === "garment_nhatbinh_01" ? "#F59E0B" : "#FFFFFF",
      pants: garmentId === "garment_tuthan_01" ? "#0F172A" : "#FFFFFF",
      inner: garmentId === "garment_tuthan_01" ? "#E11D48" : "#FFFFFF",
      belt: garmentId === "garment_tuthan_01" ? "#0284C7" : "#F59E0B",
      ...(restProps.colors || {}),
    },
    accessories: restProps.accessories || (garmentId === "garment_tuthan_01" ? ["head_khan_mo_qua_01", "shoe_guoc_moc_01"] : ["head_khan_dong_01"]),
    motifs: restProps.motifs || (garmentId === "garment_nhatbinh_01" ? ["phoenix"] : ["lotus"]),
    stickers: restProps.stickers || [],
    pattern: restProps.pattern || "plain",
  };

  const visualState: Record<TargetVisual, string> = {
    collar: "safe",
    torso: "safe",
    feet: "safe",
    head: "safe",
    bag: "safe",
  };

  const handleSelectHotspot = (targetVisual: TargetVisual, anchorIds: string[]) => {
    if (onSelectHotspot) {
      onSelectHotspot(anchorIds[0] || targetVisual);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimeFashionAvatar
        gender={gender}
        garmentId={garmentId}
        outfitConfig={outfitConfig}
        showXRay={showXRay}
        selectedTargetVisual={(selectedHotspot as TargetVisual) || null}
        onSelectHotspot={handleSelectHotspot}
        visualState={visualState}
        viewAngle={viewAngle}
      />
    </div>
  );
};

export default HeritageAvatar25D;
