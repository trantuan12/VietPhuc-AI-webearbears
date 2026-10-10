import { OutfitConfig } from "../types/studio";
import { InterpretedIntent } from "../types/ai";
import { RemixTier } from "../types/culture";

export type ViewAngle = "front" | "threeQuarter" | "collar" | "back" | "details";

export interface LookbookPromptResult {
  prompt: string;
  negativePrompt: string;
  meta: {
    modelDescription: string;
    garmentSilhouette: string;
    tierStyling: string;
    backgroundSetting: string;
    viewAngleDirective: string;
  };
}

/**
 * Builds the canonical visual prompt for Gemini Image Generation / Fashion Editorial Lookbook.
 * Strictly adheres to Gen Z contemporary Vietnamese fashion studio guidelines.
 */
export function buildGeminiLookbookPrompt(params: {
  outfitConfig: OutfitConfig;
  intent?: InterpretedIntent | null;
  eventId?: string;
  remixTier?: RemixTier;
  viewAngle?: ViewAngle;
  userPrompt?: string;
}): LookbookPromptResult {
  const {
    outfitConfig,
    intent,
    eventId = "event_grad",
    remixTier = "fusion",
    viewAngle = "front",
    userPrompt = "",
  } = params;

  const bodyColor = outfitConfig?.colors?.body || "#1E3A8A";
  const collarColor = outfitConfig?.colors?.collar || "#FFFFFF";
  const accessories = outfitConfig?.accessories || [];

  // 1. Human Model Persona (Gen Z Vietnamese fashion model)
  const modelDescription =
    "A slender, stylish young adult Vietnamese fashion model (20-25 years old) with natural, balanced fashion-model proportions, clean natural skin, minimal modern makeup, contemporary groomed hairstyle, and confident relaxed posture. Realistic human anatomy, natural hands and feet, no theatrical or elderly styling.";

  // 2. Garment Silhouette & Cultural Anchors
  // Preserves RULE_01, RULE_02 while enforcing clean straight vertical drape (not tent/balloon)
  const garmentSilhouette = `Wearing an authentic Vietnamese Áo Ngũ Thân Lập Lĩnh Tay Chẽn in solid ${bodyColor} with a crisp ${collarColor} standing collar (cổ lập lĩnh 2-4cm). The garment features a five-button curved right-side closure (hàng ngũ cúc), narrow tailored sleeves (tay chẽn) fitted along the arms with defined cuffs, and a long hem gently draping to mid-calf. The silhouette is clean, straight, relaxed and vertical with soft natural lightweight drape (linen/silk blend feel)—NOT bulky, NOT ballooned, NOT tent-shaped, showing the slender human proportions underneath.`;

  // 3. Tier Specific Contemporary Styling
  let tierStyling = "";
  if (remixTier === "classic") {
    const hasKhanDong = accessories.includes("head_khan_dong_01");
    tierStyling = `Classic heritage tier: Youthful contemporary Vietnamese heritage portrait. Styled with fluid ivory wide-leg silk trousers and minimal dark dress shoes${
      hasKhanDong ? ", wearing an authentic neatly-wrapped black/navy khăn đóng headpiece" : ""
    }. Museum-quality contemporary portrait styling with understated elegance.`;
  } else if (remixTier === "genz") {
    const hasBoots = accessories.some((a) => a.includes("boot"));
    const hasCap = accessories.includes("head_cap_01");
    tierStyling = `Gen Z streetwear tier: Edgy contemporary Vietnamese streetwear editorial. Paired with ${
      hasBoots ? "chunky black leather combat boots with lugged soles" : "clean modern designer sneakers"
    }, relaxed ivory trousers, ${
      hasCap ? "a sleek black streetwear cap, " : ""
    }tasteful contemporary layering, and an effortless modern Hanoi youth aesthetic. Non-costumey, wearable today.`;
  } else {
    // fusion (default)
    const hasSneakers = accessories.some((a) => a.includes("sneaker")) || true;
    tierStyling = `Modern fusion tier: Vietnamese heritage meets contemporary Hanoi/Seoul fashion lookbook. Styled with clean minimalist white designer sneakers, flowing ivory silk trousers, clean lines, and youthful effortless grace. Perfectly wearable by Vietnamese Gen Z university students today.`;
  }

  // 4. Background Setting based on Event Context
  let backgroundSetting = "";
  if (eventId === "event_grad") {
    backgroundSetting =
      "Background: Elegant contemporary university campus courtyard, minimalist French colonial campus architecture with warm natural daylight, modern graduation lookbook aesthetic, clean architectural depth of field.";
  } else if (eventId === "event_streetwear" || eventId.includes("street") || userPrompt.toLowerCase().includes("dạo phố")) {
    backgroundSetting =
      "Background: Stylish modern Hanoi cafe district, sunlit French colonial street facade with clean neutral tones, refined urban fashion lookbook setting.";
  } else if (eventId === "event_art" || userPrompt.toLowerCase().includes("nghệ thuật") || userPrompt.toLowerCase().includes("triển lãm")) {
    backgroundSetting =
      "Background: Minimalist contemporary art gallery, smooth architectural concrete surfaces, warm directional gallery spotlights, elegant negative space.";
  } else {
    backgroundSetting =
      "Background: High-end minimalist fashion studio, soft warm neutral cyclorama, dark slate runway floor with gentle amber key light and soft directional rim lighting.";
  }

  // 5. Multi-View Directive & Camera Perspective
  let viewAngleDirective = "";
  if (viewAngle === "threeQuarter") {
    viewAngleDirective =
      "View: Three-quarter runway perspective (35-degree angle). The same young model in a dynamic yet subtle fashion pose, highlighting the graceful diagonal right placket closure and soft drape of the back flap.";
  } else if (viewAngle === "collar") {
    viewAngleDirective =
      "View: High-fashion macro editorial close-up focused on the upper chest, neck, and standing collar (cổ lập lĩnh). Shows the crisp 2-4cm upright collar, 2mm inner white lining, and hand-crafted five golden buttons (ngũ cúc) fastened along the right curve.";
  } else if (viewAngle === "back") {
    viewAngleDirective =
      "View: Rear three-quarter fashion silhouette. The same young model showing the straight vertical center back seam (đường sống áo), side slits, and clean natural fall of the five-panel construction.";
  } else if (viewAngle === "details") {
    viewAngleDirective =
      "View: Medium-low fashion styling shot focusing on the lower hem, ivory silk trousers, and contemporary footwear styling (clean sneakers or combat boots), highlighting the Gen Z fusion details.";
  } else {
    // front (default)
    viewAngleDirective =
      "View: Full-body front lookbook photography. Centered fashion model in a confident, relaxed posture with natural weight shift, realistic hands resting comfortably, showing the complete head-to-toe outfit.";
  }

  // 6. User Intent / Color Palette Notes
  const intentNote = intent?.vibe
    ? `Mood: ${intent.vibe}, contemporary Vietnamese lookbook.`
    : userPrompt
    ? `User style direction: "${userPrompt}".`
    : "Mood: Minimalist, refined, youthfully elegant.";

  // Assemble the Canonical Prompt
  const prompt = [
    "Create a premium contemporary Vietnamese fashion editorial photograph.",
    modelDescription,
    garmentSilhouette,
    tierStyling,
    backgroundSetting,
    viewAngleDirective,
    intentNote,
    "Full-body high-end fashion photography, natural skin texture, realistic human anatomy, 85mm lens editorial aesthetic, soft professional studio lighting, 8k resolution lookbook.",
    "Cultural authenticity: Distinct Vietnamese Áo Ngũ Thân Lập Lĩnh. Strictly NOT Chinese hanfu, NOT Korean hanbok, NOT Japanese kimono.",
  ].join(" ");

  // 7. Negative Directions (Critical to prevent ugly/old/bulky output)
  const negativePrompt = [
    "elderly appearance, middle-aged face, wrinkles, bulky body, fat, inflated torso, heavy rounded shoulders, short thick neck",
    "tent-shaped garment, balloon silhouette, huge bell shape, maternity clothing, oversized costume, rigid triangular robe",
    "theatrical historical reenactment costume, imperial court cosplay, stage drama makeup, heavy powdered face, excessive gold embroidery, dragon patterns, phoenix patterns",
    "folk-art painting, traditional illustration, cartoon, chibi, anime, low-poly, 3D polygon mesh, video game NPC render, plastic mannequin",
    "Chinese hanfu, Korean hanbok, Japanese kimono, Victorian clothing, generic ancient Asian costume",
    "blurry, distorted hands, extra fingers, deformed feet, floating limbs, oversaturated colors",
  ].join(", ");

  return {
    prompt,
    negativePrompt,
    meta: {
      modelDescription,
      garmentSilhouette,
      tierStyling,
      backgroundSetting,
      viewAngleDirective,
    },
  };
}
