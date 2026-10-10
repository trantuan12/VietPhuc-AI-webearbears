import { GoogleGenAI } from "@google/genai";
import { OutfitConfig } from "../types/studio";
import { InterpretedIntent } from "../types/ai";
import { RemixTier } from "../types/culture";
import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "./constants";
import {
  buildGeminiLookbookPrompt,
  LookbookPromptResult,
  ViewAngle,
} from "./geminiPromptBuilder";

export interface MultiViewAngleSpec {
  id: "front" | "threeQuarter" | "collar" | "back" | "details";
  name: string;
  subtitle: string;
  cameraPerspective: string;
  zoomLevel: number;
  focalPoint: { x: number; y: number };
  culturalFocus: string;
  editorialDescription: string;
  stylingNotes: string[];
  prompt: string;
}

export interface CulturalTwinVisualSpec {
  collectionTitle: string;
  styleVibe: string;
  lightingTheme: string;
  fabricTexture: {
    weaveType: string;
    luster: "sheen" | "matte" | "subtle_silk";
    primaryColor: string;
    collarColor: string;
  };
  canonicalPrompt: string;
  negativePrompt: string;
  angles: MultiViewAngleSpec[];
  culturalHotspots: {
    id: string;
    targetVisual: "collar" | "torso" | "feet" | "head";
    name: string;
    statusNote: string;
    historicalContext: string;
    screenPosition: { x: number; y: number }; // percentage [0-100]
  }[];
}

export async function synthesizeCulturalTwinVisual(params: {
  outfitConfig: OutfitConfig;
  intent?: InterpretedIntent | null;
  eventId?: string;
  remixTier?: RemixTier;
  userPrompt?: string;
}): Promise<CulturalTwinVisualSpec> {
  const apiKey = process.env.GEMINI_API_KEY;
  const bodyColor = params.outfitConfig?.colors?.body || "#1E3A8A";
  const collarColor = params.outfitConfig?.colors?.collar || "#FFFFFF";
  const accessories = params.outfitConfig?.accessories || [];
  const eventId = params.eventId || "event_grad";
  const remixTier = params.remixTier || "fusion";

  // Build the canonical front look prompt
  const frontPromptResult = buildGeminiLookbookPrompt({
    outfitConfig: params.outfitConfig,
    intent: params.intent,
    eventId,
    remixTier,
    viewAngle: "front",
    userPrompt: params.userPrompt,
  });

  const threeQuarterResult = buildGeminiLookbookPrompt({
    outfitConfig: params.outfitConfig,
    intent: params.intent,
    eventId,
    remixTier,
    viewAngle: "threeQuarter",
    userPrompt: params.userPrompt,
  });

  const collarResult = buildGeminiLookbookPrompt({
    outfitConfig: params.outfitConfig,
    intent: params.intent,
    eventId,
    remixTier,
    viewAngle: "collar",
    userPrompt: params.userPrompt,
  });

  const backResult = buildGeminiLookbookPrompt({
    outfitConfig: params.outfitConfig,
    intent: params.intent,
    eventId,
    remixTier,
    viewAngle: "back",
    userPrompt: params.userPrompt,
  });

  const detailsResult = buildGeminiLookbookPrompt({
    outfitConfig: params.outfitConfig,
    intent: params.intent,
    eventId,
    remixTier,
    viewAngle: "details",
    userPrompt: params.userPrompt,
  });

  const defaultSpec: CulturalTwinVisualSpec = {
    collectionTitle: params.intent?.vibe
      ? `Cổ Phục Gen Z – ${params.intent.vibe.toUpperCase()}`
      : "Cổ Phục Gen Z – Bản Phối Đương Đại",
    styleVibe: params.intent?.vibe || "Đương đại • Thanh lịch • Tối giản",
    lightingTheme:
      eventId === "event_grad"
        ? "Ánh sáng tự nhiên sân trường đại học, daylight nhẹ nhàng, chiều sâu kiến trúc Pháp cổ"
        : "Ánh sáng studio lookbook cao cấp, key light dịu, rim light tinh tế",
    fabricTexture: {
      weaveType: "Chất liệu dệt mềm mại, linen / lụa tơ tằm pha tự nhiên, rũ thẳng thanh thoát",
      luster: "matte",
      primaryColor: bodyColor,
      collarColor: collarColor,
    },
    canonicalPrompt: frontPromptResult.prompt,
    negativePrompt: frontPromptResult.negativePrompt,
    angles: [
      {
        id: "front",
        name: "Toàn Thân Chính Diện",
        subtitle: "Front Fashion Lookbook",
        cameraPerspective: "Chính diện toàn thân tỷ lệ chuẩn người mẫu, thần thái tự tin, dáng đứng thư thái",
        zoomLevel: 1.0,
        focalPoint: { x: 50, y: 50 },
        culturalFocus: "Khối áo 5 thân (ngũ thân) rũ thẳng tự nhiên, không phồng, vạt đè bên phải khép kín trang nhã.",
        editorialDescription: `Người mẫu Việt Nam trẻ (20-25 tuổi), vóc dáng thanh mảnh, diện Áo Ngũ Thân màu ${bodyColor} phối cổ đứng ${collarColor}, quần thụng lụa trắng và phong cách đương đại.`,
        stylingNotes: [
          "Phom áo suông thẳng, buông rũ tự nhiên theo trọng lực, không chiết eo, không phồng",
          "Tay chẽn ôm gọn cánh tay, cổ tay thu lại rõ ràng",
          accessories.length ? `Phụ kiện: ${accessories.join(", ")}` : "Tối giản, thanh tao",
        ],
        prompt: frontPromptResult.prompt,
      },
      {
        id: "threeQuarter",
        name: "Góc Nghiêng 3/4 Runway",
        subtitle: "Dynamic Perspective",
        cameraPerspective: "Góc xoay 35 độ, tư thế người mẫu uyển chuyển tự nhiên",
        zoomLevel: 1.15,
        focalPoint: { x: 52, y: 48 },
        culturalFocus: "Đường lượn nẹp áo cài sang nách phải và độ rủ nhẹ nhàng của vạt sau.",
        editorialDescription: "Tôn lên vẻ đẹp chuyển động của người trẻ trong tà áo di sản, đường cắt may thẳng thớm, độ rủ mềm mại.",
        stylingNotes: [
          "Góc nhìn bắt trọn đường cong nẹp áo ngực bên phải và hàng ngũ cúc",
          "Chất liệu mềm mại phản chiếu ánh sáng studio dịu nhẹ",
        ],
        prompt: threeQuarterResult.prompt,
      },
      {
        id: "collar",
        name: "Cận Cảnh Cổ & Ngũ Cúc",
        subtitle: "Craftsmanship Macro",
        cameraPerspective: "Góc cận macro từ xương đòn tới cổ áo",
        zoomLevel: 2.2,
        focalPoint: { x: 50, y: 28 },
        culturalFocus: "Cổ Lập Lĩnh (đứng 2-4cm) và hàng Ngũ Cúc (5 khuy kim loại/ngọc) - RULE_01 & RULE_02.",
        editorialDescription: "Độ sắc nét tuyệt đối của đường may cổ đứng khép kín với lớp lót trắng tinh khôi và 5 hạt cúc vàng chế tác tinh xảo.",
        stylingNotes: [
          "Cổ áo dựng đứng ôm khít, không hở cổ họng (Chuẩn Lập Lĩnh)",
          "5 cúc: 1 ở cổ, 1 ở xương quai xanh, 1 ở nách, 2 ở sườn phải",
        ],
        prompt: collarResult.prompt,
      },
      {
        id: "back",
        name: "Góc Vạt & Tà Sau",
        subtitle: "Five-Panel Structure",
        cameraPerspective: "Góc nghiêng sau lưng 45 độ",
        zoomLevel: 1.25,
        focalPoint: { x: 48, y: 55 },
        culturalFocus: "Đường sống áo lưng (trung phẫu) và xẻ tà hai bên hông chuẩn áo ngũ thân.",
        editorialDescription: "Minh chứng cho kỹ thuật ghép 5 thân: 2 thân trước, 2 thân sau ghép sống lưng, và 1 thân con ẩn phía trong.",
        stylingNotes: [
          "Đường chỉ sống lưng thẳng tắp tượng trưng cho sự chính trực",
          "Tà áo buông rũ tự nhiên, xẻ tà cao vừa phải",
        ],
        prompt: backResult.prompt,
      },
      {
        id: "details",
        name: "Phụ Kiện & Giày Gen Z",
        subtitle: "Streetwear Fusion Detail",
        cameraPerspective: "Góc tầm thấp tập trung chân và phụ kiện phối",
        zoomLevel: 1.7,
        focalPoint: { x: 50, y: 82 },
        culturalFocus: "Sự kết hợp giữa chân gấu áo ngũ thân và phụ kiện hiện đại (RULE_03).",
        editorialDescription: "Điểm nhấn phong cách giao thoa giữa di sản và tinh thần tự do phóng khoáng của thế hệ trẻ.",
        stylingNotes: [
          accessories.some((a) => a.includes("shoe"))
            ? "Đôi giày hiện đại tạo nét chấm phá streetwear năng động"
            : "Hài vải / giày tối giản tạo phong thái thanh lịch",
          "Quần lụa buông vừa chạm cổ giày, tạo tỉ lệ cân đối hoàn hảo",
        ],
        prompt: detailsResult.prompt,
      },
    ],
    culturalHotspots: [
      {
        id: "spot_collar",
        targetVisual: "collar",
        name: "Cổ Lập Lĩnh (Đứng khép kín)",
        statusNote: "Bảo tồn nghiêm ngặt RULE_01",
        historicalContext: "Cao 2-4cm, dựng đứng ôm sát cổ, biểu trưng cho phong thái đoan trang, lễ nghi.",
        screenPosition: { x: 50, y: 26 },
      },
      {
        id: "spot_torso",
        targetVisual: "torso",
        name: "Thân Áo & Hàng Ngũ Cúc",
        statusNote: "Bảo tồn nghiêm ngặt RULE_02",
        historicalContext: "Kết cấu 5 thân ghép sống lưng cùng 5 khuy cài tượng trưng cho Nhân - Lễ - Nghĩa - Trí - Tín.",
        screenPosition: { x: 53, y: 44 },
      },
      {
        id: "spot_feet",
        targetVisual: "feet",
        name: "Phụ Kiện Giày Phối Đồ",
        statusNote: "Phối ghép văn hóa RULE_03",
        historicalContext: "Có thể phối cùng Sneaker hoặc Combat Boot theo Tier Remix được chọn nhưng không được gây phản cảm.",
        screenPosition: { x: 50, y: 88 },
      },
      {
        id: "spot_head",
        targetVisual: "head",
        name: "Khăn Đóng / Mũ Trùm Đầu",
        statusNote: "Phụ kiện vùng đầu",
        historicalContext: "Khăn đóng quấn nếp chữ Nhất hoặc chữ Nhân biểu trưng cho sự ngay thẳng và khiêm cung.",
        screenPosition: { x: 50, y: 15 },
      },
    ],
  };

  if (!apiKey) {
    return defaultSpec;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
      },
    });

    const promptText = `
Bạn là Giám đốc Sáng tạo của Cổ Phục Gen Z Fashion Studio (Việt Nam 2026).
Đây là một AI Fashion Studio dành cho người trẻ hiện đại diện Việt phục Áo Ngũ Thân theo phong cách fashion editorial / lookbook.
KHÔNG PHẢI phim cổ trang, KHÔNG PHẢI cosplay bảo tàng thế kỷ 19.

Bản phối hiện tại:
- Màu thân áo: ${bodyColor}
- Màu cổ áo: ${collarColor}
- Phụ kiện: ${accessories.join(", ") || "Tối giản"}
- Event: ${eventId}
- Remix Tier: ${remixTier}
- User prompt: "${params.userPrompt || ""}"
- Vibe phân tích: "${params.intent?.vibe || "thanh lịch"}"

Hãy trả về JSON (không có markdown codeblock) với nhận định thời trang ngắn:
{
  "collectionTitle": "Tên lookbook ngắn gọn, sang trọng, mang hơi thở Gen Z",
  "styleVibe": "3 từ khóa phong cách ngăn cách bởi dấu chấm",
  "lightingTheme": "1 câu mô tả ánh sáng studio hoặc bối cảnh ngoài trời thanh lịch",
  "editorialNotes": "1-2 câu ngắn gọn của Giám đốc Sáng tạo về bản phối này"
}
`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(GEMINI_TIMEOUT_MS, 10000));

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
          abortSignal: controller.signal,
        },
      });

      const text = response?.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.collectionTitle) defaultSpec.collectionTitle = parsed.collectionTitle;
        if (parsed.styleVibe) defaultSpec.styleVibe = parsed.styleVibe;
        if (parsed.lightingTheme) defaultSpec.lightingTheme = parsed.lightingTheme;
        if (parsed.editorialNotes) {
          defaultSpec.angles[0].editorialDescription = parsed.editorialNotes;
        }
      }
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    console.warn("Gemini visual synthesis warning (using verified cultural default spec):", err);
  }

  return defaultSpec;
}

/**
 * Executes or simulates lookbook generation with Gemini
 */
export async function generateGeminiLookImage(params: {
  outfitConfig: OutfitConfig;
  intent?: InterpretedIntent | null;
  eventId?: string;
  remixTier?: RemixTier;
  viewAngle?: ViewAngle;
  userPrompt?: string;
}): Promise<{
  success: boolean;
  prompt: string;
  negativePrompt: string;
  imageUrl?: string;
  error?: string;
  errorCode?: string;
}> {
  const promptData = buildGeminiLookbookPrompt(params);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      prompt: promptData.prompt,
      negativePrompt: promptData.negativePrompt,
      errorCode: "MISSING_API_KEY",
      error: "Chưa cấu hình GEMINI_API_KEY.",
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });

  try {
    // Attempt Gemini image generation using nano banana series models
    const res = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: promptData.prompt,
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        },
      },
    });

    const parts = res.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || "image/jpeg";
        const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        return {
          success: true,
          prompt: promptData.prompt,
          negativePrompt: promptData.negativePrompt,
          imageUrl,
        };
      }
    }

    return {
      success: false,
      prompt: promptData.prompt,
      negativePrompt: promptData.negativePrompt,
      errorCode: "NO_IMAGE_DATA",
      error: "Không nhận được dữ liệu hình ảnh từ mô hình.",
    };
  } catch (err: any) {
    const isQuota =
      err.message?.includes("RESOURCE_EXHAUSTED") ||
      err.message?.includes("429") ||
      err.message?.includes("quota") ||
      err.message?.includes("limit: 0");

    return {
      success: false,
      prompt: promptData.prompt,
      negativePrompt: promptData.negativePrompt,
      errorCode: isQuota ? "QUOTA_EXCEEDED" : "API_ERROR",
      error: isQuota
        ? "Mô hình Gemini Image Generation đang yêu cầu Paid API Key hoặc quota miễn phí tạm hết. Hệ thống đã chuẩn bị sẵn Canonical Prompt chuẩn xác để bạn kiểm tra hoặc tạo ảnh trong AI Studio."
        : err.message || "Lỗi tạo hình ảnh từ Gemini.",
    };
  }
}
