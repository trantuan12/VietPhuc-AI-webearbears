import garmentsData from "../data/garments.json" with { type: "json" };
import eventsData from "../data/events.json" with { type: "json" };
import rulesData from "../data/cultural_rules.json" with { type: "json" };
import inventoryData from "../data/inventory.json" with { type: "json" };

import { Garment, EventData, CulturalRule, InventoryItem } from "../types/culture";
import { Finding, RemixGeminiOutput, InterpretedIntent } from "../types/ai";
import { RemixRequestPayload, StylistApiResponse, SemanticSnapshot } from "../types/api";
import { OutfitConfig } from "../types/studio";

import {
  filterVerifiedAnchors,
  filterVerifiedFacts,
  filterVerifiedRules,
} from "./provenance";
import { runDeterministicRules } from "./ruleEngine";
import { calculateCulturalScore } from "./scoring";
import { computeVisualState } from "./visualState";
import { generateRepairCandidates } from "./repair";
import { validateRemixRequest } from "./requestValidator";
import { callGeminiAPI } from "./gemini";
import { REMIX_SYSTEM_INSTRUCTION } from "./prompts";
import { REMIX_RESPONSE_SCHEMA } from "./schemas";
import { validateRemixOutput } from "./validators";
import { sanitizeHexColor, normalizeText } from "./constants";
import { computeCalloutAnnotations } from "./calloutHelper";

const garments: Garment[] = garmentsData as Garment[];
const events: EventData[] = eventsData as EventData[];
const allRules: CulturalRule[] = rulesData as CulturalRule[];
const inventory: InventoryItem[] = inventoryData as InventoryItem[];

export async function handleRemix(rawPayload: any): Promise<StylistApiResponse> {
  const req: RemixRequestPayload = validateRemixRequest(rawPayload, garments, events);
  const garment = garments.find((g) => g.id === req.base_garment_id)!;
  const event = events.find((e) => e.id === req.event_id)!;

  // Filter verified objects
  const verifiedAnchors = filterVerifiedAnchors(garment.anchors);
  const verifiedFacts = filterVerifiedFacts(garment.educational_facts);
  const verifiedRules = filterVerifiedRules(allRules, garment.id);

  const activeSemanticRules = verifiedRules.filter((r) => r.evaluation_type === "semantic");
  const deterministicRules = verifiedRules.filter((r) => r.evaluation_type === "deterministic");

  const validInventoryIds = new Set(inventory.map((i) => i.id));

  let geminiOutput: RemixGeminiOutput | null = null;
  let aiStatus: "ok" | "timeout" | "error" = "ok";
  let errorMessage: string | undefined = undefined;
  let isSemanticComplete = false;

  const buildUserContent = (feedback?: string) => {
    const payload: any = {
      user_prompt: req.user_prompt,
      event: {
        id: event.id,
        name: event.name,
        allowed_remix_tiers: event.allowed_remix_tiers,
      },
      remix_tier: req.remix_tier,
      base_garment: {
        id: garment.id,
        name: garment.name,
        original_colors: garment.original_visual_config.colors,
      },
      renderable_inventory: inventory.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        vibes: item.vibes,
        colors: item.colors,
        remix_tiers: item.remix_tiers,
        allowed_events: item.allowed_events,
      })),
      active_semantic_rules: activeSemanticRules.map((r) => ({
        id: r.id,
        target_visual: r.target_visual,
        criteria: r.semantic_criteria,
        description: r.description,
      })),
    };
    if (feedback) {
      payload.feedback = feedback;
    }
    return JSON.stringify(payload, null, 2);
  };

  let modelUsed: string | undefined = undefined;

  // Attempt 1
  try {
    const res1 = await callGeminiAPI({
      systemInstruction: REMIX_SYSTEM_INSTRUCTION,
      userContent: buildUserContent(),
      responseSchema: REMIX_RESPONSE_SCHEMA,
    });
    const errors1 = validateRemixOutput(res1.data, activeSemanticRules, req.user_prompt);
    if (errors1.length === 0) {
      geminiOutput = res1.data;
      modelUsed = res1.modelUsed;
      isSemanticComplete = true;
    } else {
      // Retry once with feedback
      const feedback = `Previous output failed schema validation: ${errors1.join(
        "; "
      )}. Please strictly fix the errors.`;
      try {
        const res2 = await callGeminiAPI({
          systemInstruction: REMIX_SYSTEM_INSTRUCTION,
          userContent: buildUserContent(feedback),
          responseSchema: REMIX_RESPONSE_SCHEMA,
        });
        const errors2 = validateRemixOutput(res2.data, activeSemanticRules, req.user_prompt);
        if (errors2.length === 0) {
          geminiOutput = res2.data;
          modelUsed = res2.modelUsed;
          isSemanticComplete = true;
        } else {
          aiStatus = "error";
          errorMessage = `Validation failed after retry: ${errors2.join("; ")}`;
        }
      } catch (retryErr: any) {
        aiStatus = retryErr?.isTimeout ? "timeout" : "error";
        errorMessage = retryErr?.message;
      }
    }
  } catch (err: any) {
    aiStatus = err?.isTimeout ? "timeout" : "error";
    errorMessage = err?.message;
  }

  // Kiểm tra lỗi AI: Nếu AI báo lỗi (timeout, 503, validation error, v.v.), thông báo ngay lập tức cho người dùng
  if (!geminiOutput || !isSemanticComplete || aiStatus !== "ok") {
    let friendlyMsg = "Có lỗi xảy ra: AI Gemini hiện không hoạt động!";
    const raw = (errorMessage || "").toLowerCase();
    if (aiStatus === "timeout" || raw.includes("timeout")) {
      friendlyMsg = "Có lỗi xảy ra: AI Gemini phản hồi quá thời gian chờ (Timeout). AI hiện không hoạt động, vui lòng thử lại!";
    } else if (raw.includes("503") || raw.includes("overloaded") || raw.includes("high demand") || raw.includes("unavailable")) {
      friendlyMsg = "Có lỗi xảy ra: AI Gemini đang quá tải (Lỗi 503 High Demand). AI hiện không hoạt động, vui lòng thử lại sau giây lát!";
    } else if (raw.includes("429") || raw.includes("quota") || raw.includes("exhausted")) {
      friendlyMsg = "Có lỗi xảy ra: AI Gemini tạm thời hết hạn ngạch truy vấn (Lỗi 429 Quota Exceeded). AI hiện không hoạt động!";
    } else if (raw.includes("404") || raw.includes("not found")) {
      friendlyMsg = "Có lỗi xảy ra: Không tìm thấy mô hình AI Gemini (Lỗi 404 Model Not Found). AI hiện không hoạt động!";
    } else if (raw.includes("key") || raw.includes("api_key")) {
      friendlyMsg = "Có lỗi xảy ra: Khóa API Gemini không hợp lệ hoặc bị thiếu. AI hiện không hoạt động!";
    } else if (errorMessage) {
      friendlyMsg = `Có lỗi xảy ra từ AI: ${errorMessage}. AI hiện không hoạt động!`;
    }

    const errorObj = new Error(friendlyMsg);
    (errorObj as any).statusCode = (raw.includes("503") || raw.includes("overloaded")) ? 503 : 500;
    throw errorObj;
  }

  let finalConfig: OutfitConfig;
  let interpretedIntent: InterpretedIntent | null = null;
  let semanticFindings: Finding[] = [];
  let semanticSnapshot: SemanticSnapshot | null = null;

  // Check if user explicitly asked for color in prompt
  const norm = normalizeText(req.user_prompt);
    const colorKeywords = [
      "màu", "tone", "sắc", "xanh", "đỏ", "vàng", "tím", "đen", "trắng",
      "hồng", "lục", "lam", "cam", "nâu", "vnu", "pastel", "ngọc", "navy",
      "bạch", "hoàng", "huyết", "hỏa"
    ];
    // Strip motif names that contain color words like "cây xanh" so they don't falsely trigger garment color changes
    const promptForColorCheck = norm
      .replace(/lá vàng rơi/g, "")
      .replace(/lá vàng/g, "")
      .replace(/lá phong/g, "")
      .replace(/cây xanh/g, "")
      .replace(/mây ngũ sắc/g, "")
      .replace(/ngũ sắc/g, "")
      .replace(/bạch hạc/g, "")
      .replace(/hoa mai vàng/g, "")
      .replace(/sen hồng/g, "");

    const promptHasColor = colorKeywords.some((kw) => promptForColorCheck.includes(kw));
    const rawColors = geminiOutput.outfit_config.colors;

    const userMotifs = new Set(geminiOutput.outfit_config.motifs || []);
    const userStickers = new Set(geminiOutput.outfit_config.stickers || []);

    // Custom motifs extraction from user prompt
    if (norm.includes("lá vàng") || norm.includes("lá vàng rơi") || norm.includes("la vang") || norm.includes("lá rơi") || norm.includes("lá phong") || norm.includes("autumn") || norm.includes("hoàng diệp") || norm.includes("lá thu")) {
      userMotifs.add("golden_leaves");
    }
    if (norm.includes("kiếm") || norm.includes("thanh kiếm") || norm.includes("thánh kiếm") || norm.includes("bảo kiếm") || norm.includes("sword") || norm.includes("gươm")) {
      userMotifs.add("sword_legend");
    }
    if (norm.includes("cây") || norm.includes("cây xanh") || norm.includes("tre") || norm.includes("trúc") || norm.includes("tùng") || norm.includes("pine") || norm.includes("bamboo")) {
      userMotifs.add("pine_bamboo");
    }
    if (norm.includes("chiết") || norm.includes("eo chiết") || norm.includes("bó") || norm.includes("ôm eo")) {
      userMotifs.add("fitted_waist");
    }

    if (norm.includes("rồng") || norm.includes("long") || norm.includes("dragon")) userMotifs.add("dragon");
    if (norm.includes("đào") || norm.includes("hoa đào") || norm.includes("blossom")) userMotifs.add("peach_blossom");
    if (norm.includes("phượng") || norm.includes("phoenix")) userMotifs.add("phoenix");
    if (norm.includes("hạc") || norm.includes("crane")) userMotifs.add("crane");
    if (norm.includes("sen") || norm.includes("lotus")) userMotifs.add("lotus");
    if (norm.includes("mây") || norm.includes("cloud")) {
      if (norm.includes("mây đen") || norm.includes("mây màu đen") || (norm.includes("mây") && norm.includes("đen")) || norm.includes("black cloud") || norm.includes("hắc vân")) {
        userMotifs.delete("cloud_swirl");
        userMotifs.add("cloud_black");
      } else {
        userMotifs.add("cloud_swirl");
      }
    }
    if (norm.includes("tứ quý")) userMotifs.add("tu_quy");

    if (norm.includes("sticker") || norm.includes("hình dán") || norm.includes("cá tính") || norm.includes("chất") || norm.includes("y2k")) {
      userStickers.add("cyber_badge");
      userStickers.add("genz_star");
      userStickers.add("viet_tag");
    }
    if (norm.includes("anime") || norm.includes("wibu") || norm.includes("otaku") || norm.includes("manga")) {
      userStickers.add("cyber_badge");
      userStickers.add("genz_star");
      userStickers.add("lightning_pin");
      userStickers.add("retro_smile");
    }
    if (norm.includes("sét") || norm.includes("lightning")) userStickers.add("lightning_pin");
    if (norm.includes("mặt cười") || norm.includes("smile")) userStickers.add("retro_smile");
    if (norm.includes("mã vạch") || norm.includes("barcode")) userStickers.add("barcode_tag");

    let resolvedBody = sanitizeHexColor(rawColors.body, garment.original_visual_config.colors.body);
    let resolvedCollar = sanitizeHexColor(rawColors.collar, garment.original_visual_config.colors.collar);
    let resolvedPants = sanitizeHexColor((rawColors as any).pants, (garment.original_visual_config.colors as any).pants || "#FFFFFF");
    let resolvedBelt = (rawColors as any).belt ? sanitizeHexColor((rawColors as any).belt, "#0284C7") : undefined;

    if (norm.includes("xanh da trời") || norm.includes("xanh da troi") || norm.includes("xanh dương") || norm.includes("xanh duong") || norm.includes("sky blue") || norm.includes("xanh biển") || norm.includes("xanh pastel")) {
      resolvedBody = "#38BDF8"; // Sky Blue
      if (!norm.includes("quần")) resolvedPants = "#FFFFFF";
      if (!norm.includes("cổ") && !norm.includes("mix")) resolvedCollar = "#F59E0B";
    } else if (norm.includes("vnu") || norm.includes("đồng phục vnu") || norm.includes("đại học quốc gia")) {
      resolvedBody = "#0054A6"; // Official VNU Blue
      resolvedCollar = "#FFFFFF";
      resolvedPants = "#0F172A";
      resolvedBelt = "#059669";
    } else if (norm.includes("hust") || norm.includes("đồng phục hust") || norm.includes("bách khoa") || norm.includes("bach khoa")) {
      resolvedBody = "#DC2626"; // Official HUST Red
      resolvedCollar = "#FFFFFF";
      resolvedPants = "#FFFFFF";
      resolvedBelt = "#18181B";
    } else if (!promptHasColor && req.current_colors) {
      // If user did not specify color in prompt, preserve current_colors from bottom palette!
      if (req.current_colors.body) resolvedBody = req.current_colors.body;
      if (req.current_colors.collar) resolvedCollar = req.current_colors.collar;
      if (req.current_colors.pants) resolvedPants = req.current_colors.pants;
      if (req.current_colors.belt) resolvedBelt = req.current_colors.belt;
    }

    if (norm.includes("chiết") || norm.includes("eo chiết") || norm.includes("bó") || norm.includes("ôm eo")) {
      resolvedBelt = resolvedBelt || "#F59E0B";
    }

    finalConfig = {
      colors: {
        body: resolvedBody,
        collar: resolvedCollar,
        pants: resolvedPants,
        inner: (rawColors as any).inner ? sanitizeHexColor((rawColors as any).inner, "#E11D48") : (norm.includes("yếm") ? "#E11D48" : undefined),
        belt: resolvedBelt,
      },
      accessories: geminiOutput.outfit_config.accessories.filter((id) =>
        validInventoryIds.has(id)
      ),
      motifs: Array.from(userMotifs),
      stickers: Array.from(userStickers),
      pattern: (norm.includes("anime") || norm.includes("wibu")) ? "anime" : (geminiOutput.outfit_config.pattern || (norm.includes("trống đồng") ? "dong_son" : "plain")),
    };
    interpretedIntent = geminiOutput.interpreted_intent;
    if (!interpretedIntent.callout_annotations) {
      interpretedIntent.callout_annotations = computeCalloutAnnotations({
        garmentId: garment.id,
        prompt: req.user_prompt,
        outfitConfig: finalConfig,
        remixTier: req.remix_tier,
      });
    }

    // Convert semantic findings to Finding
    for (const sf of geminiOutput.semantic_findings) {
      const rule = activeSemanticRules.find((r) => r.id === sf.rule_id);
      if (!rule) continue;
      const criterionText =
        sf.matched_criterion === "caution_when"
          ? rule.semantic_criteria?.caution_when
          : rule.semantic_criteria?.conflict_when;

      semanticFindings.push({
        rule_id: rule.id,
        anchor_id: rule.anchor_id,
        result: sf.result,
        target_visual: rule.target_visual,
        evidence: sf.evidence_from_request,
        explanation: criterionText || rule.description,
        source_ids: rule.source_ids || [],
      });
    }

    semanticSnapshot = {
      original_prompt: req.user_prompt,
      evaluated_rule_ids: geminiOutput.evaluated_rule_ids,
      semantic_findings: geminiOutput.semantic_findings,
    };


  // Run deterministic rule engine
  const deterministicFindings = runDeterministicRules(
    deterministicRules,
    event.id,
    finalConfig.accessories
  );

  const allFindings = [...deterministicFindings, ...semanticFindings];

  const scoreData = calculateCulturalScore(
    allFindings,
    verifiedRules,
    event,
    req.remix_tier,
    finalConfig.accessories,
    inventory,
    isSemanticComplete
  );

  const visualState = computeVisualState(allFindings, verifiedRules, isSemanticComplete);

  // Check repair data
  let repairData: StylistApiResponse["repair_data"] = {
    can_repair: false,
    last_repair_info: null,
  };

  const deterministicConflict = deterministicFindings.find((f) => f.result === "conflict");
  if (deterministicConflict && deterministicConflict.evidence) {
    const conflictItemId = deterministicConflict.evidence;
    const candidates = generateRepairCandidates(
      conflictItemId,
      event.id,
      req.remix_tier,
      deterministicRules,
      finalConfig.accessories,
      inventory
    );

    if (candidates.length > 0) {
      repairData = {
        can_repair: true,
        conflict_item_id: conflictItemId,
        candidates,
        last_repair_info: null,
      };
    } else {
      repairData = {
        can_repair: false,
        conflict_item_id: conflictItemId,
        reason: "no_candidates_available",
        repair_reason: "no_candidates_available",
        last_repair_info: null,
      };
    }
  } else {
    const semanticConflict = semanticFindings.some((f) => f.result === "conflict");
    if (semanticConflict) {
      repairData = {
        can_repair: false,
        reason: "semantic_conflict_requires_user_adjustment",
        repair_reason: "semantic_conflict_requires_user_adjustment",
        last_repair_info: null,
      };
    }
  }

  return {
    execution_status: {
      ai_status: aiStatus,
      model_used: modelUsed,
      score_complete: scoreData.score_complete,
      semantic_analysis_complete: scoreData.semantic_analysis_complete,
    },
    error_message: errorMessage,
    interpreted_intent: interpretedIntent,
    outfit_config: finalConfig,
    cultural_evaluation: {
      score: scoreData,
      findings: allFindings,
    },
    visual_state: visualState,
    repair_data: repairData,
    cultural_content: {
      anchors: verifiedAnchors,
      educational_facts: verifiedFacts,
    },
    semantic_snapshot: semanticSnapshot,
  };
}
