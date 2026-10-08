import garmentsData from "../data/garments.json" with { type: "json" };
import eventsData from "../data/events.json" with { type: "json" };
import rulesData from "../data/cultural_rules.json" with { type: "json" };
import inventoryData from "../data/inventory.json" with { type: "json" };

import { Garment, EventData, CulturalRule, InventoryItem } from "../types/culture";
import { Finding, RepairGeminiOutput } from "../types/ai";
import { RepairRequestPayload, StylistApiResponse } from "../types/api";

import {
  filterVerifiedAnchors,
  filterVerifiedFacts,
  filterVerifiedRules,
} from "./provenance";
import { runDeterministicRules } from "./ruleEngine";
import { calculateCulturalScore } from "./scoring";
import { computeVisualState } from "./visualState";
import { generateRepairCandidates } from "./repair";
import { validateRepairRequest } from "./requestValidator";
import { callGeminiAPI } from "./gemini";
import { REPAIR_SYSTEM_INSTRUCTION } from "./prompts";
import { REPAIR_RESPONSE_SCHEMA } from "./schemas";
import { validateRepairOutput } from "./validators";

const garments: Garment[] = garmentsData as Garment[];
const events: EventData[] = eventsData as EventData[];
const allRules: CulturalRule[] = rulesData as CulturalRule[];
const inventory: InventoryItem[] = inventoryData as InventoryItem[];

export async function handleRepair(rawPayload: any): Promise<StylistApiResponse> {
  const garmentId = rawPayload?.base_garment_id || "garment_nguthan_01";
  const garment = garments.find((g) => g.id === garmentId)!;
  const verifiedRules = filterVerifiedRules(allRules, garmentId);
  const deterministicRules = verifiedRules.filter((r) => r.evaluation_type === "deterministic");
  const activeSemanticRules = verifiedRules.filter((r) => r.evaluation_type === "semantic");

  const { payload: req, canonicalConflictItemId } = validateRepairRequest(
    rawPayload,
    garments,
    events,
    inventory,
    deterministicRules
  );

  const event = events.find((e) => e.id === req.event_id)!;
  const verifiedAnchors = filterVerifiedAnchors(garment.anchors);
  const verifiedFacts = filterVerifiedFacts(garment.educational_facts);

  // Revalidate semantic snapshot
  let revalidatedSemanticFindings: Finding[] = [];
  let isSemanticComplete = false;

  if (req.semantic_snapshot) {
    const { evaluated_rule_ids, semantic_findings } = req.semantic_snapshot;
    const activeSemanticRuleIds = activeSemanticRules.map((r) => r.id);

    if (
      activeSemanticRules.length > 0 &&
      Array.isArray(evaluated_rule_ids) &&
      activeSemanticRuleIds.every((id) => evaluated_rule_ids.includes(id))
    ) {
      isSemanticComplete = true;
    }

    if (Array.isArray(semantic_findings)) {
      for (const sf of semantic_findings) {
        const rule = activeSemanticRules.find((r) => r.id === sf.rule_id);
        if (!rule) continue;
        const criterionText =
          sf.matched_criterion === "caution_when"
            ? rule.semantic_criteria?.caution_when
            : rule.semantic_criteria?.conflict_when;

        revalidatedSemanticFindings.push({
          rule_id: rule.id,
          anchor_id: rule.anchor_id,
          result: sf.result,
          target_visual: rule.target_visual,
          evidence: sf.evidence_from_request,
          explanation: criterionText || rule.description,
          source_ids: rule.source_ids || [],
        });
      }
    }
  }

  // If no conflict item exists
  if (!canonicalConflictItemId) {
    const initialDeterministicFindings = runDeterministicRules(
      deterministicRules,
      event.id,
      req.current_config.accessories
    );
    const allFindings = [...initialDeterministicFindings, ...revalidatedSemanticFindings];
    const scoreData = calculateCulturalScore(
      allFindings,
      verifiedRules,
      event,
      req.remix_tier,
      req.current_config.accessories,
      inventory,
      isSemanticComplete
    );
    const visualState = computeVisualState(allFindings, verifiedRules, isSemanticComplete);

    return {
      execution_status: {
        ai_status: "ok",
        score_complete: scoreData.score_complete,
        semantic_analysis_complete: scoreData.semantic_analysis_complete,
      },
      interpreted_intent: null,
      outfit_config: req.current_config,
      cultural_evaluation: {
        score: scoreData,
        findings: allFindings,
      },
      visual_state: visualState,
      repair_data: {
        can_repair: false,
        conflict_item_id: null,
        repair_reason: null,
        last_repair_info: null,
      },
      cultural_content: {
        anchors: verifiedAnchors,
        educational_facts: verifiedFacts,
      },
      semantic_snapshot: req.semantic_snapshot ?? null,
    };
  }

  // Generate candidates
  const candidates = generateRepairCandidates(
    canonicalConflictItemId,
    event.id,
    req.remix_tier,
    deterministicRules,
    req.current_config.accessories,
    inventory
  );

  // If no candidates
  if (candidates.length === 0) {
    const initialDeterministicFindings = runDeterministicRules(
      deterministicRules,
      event.id,
      req.current_config.accessories
    );
    const allFindings = [...initialDeterministicFindings, ...revalidatedSemanticFindings];
    const scoreData = calculateCulturalScore(
      allFindings,
      verifiedRules,
      event,
      req.remix_tier,
      req.current_config.accessories,
      inventory,
      isSemanticComplete
    );
    const visualState = computeVisualState(allFindings, verifiedRules, isSemanticComplete);

    return {
      execution_status: {
        ai_status: "ok",
        score_complete: scoreData.score_complete,
        semantic_analysis_complete: scoreData.semantic_analysis_complete,
      },
      interpreted_intent: null,
      outfit_config: req.current_config,
      cultural_evaluation: {
        score: scoreData,
        findings: allFindings,
      },
      visual_state: visualState,
      repair_data: {
        can_repair: false,
        conflict_item_id: canonicalConflictItemId,
        reason: "no_candidates_available",
        repair_reason: "no_candidates_available",
        candidates: [],
        last_repair_info: null,
      },
      cultural_content: {
        anchors: verifiedAnchors,
        educational_facts: verifiedFacts,
      },
      semantic_snapshot: req.semantic_snapshot ?? null,
    };
  }

  // Call Gemini to select replacement
  const buildRepairUserContent = (feedback?: string) => {
    const candidateItems = candidates
      .map((id) => inventory.find((i) => i.id === id))
      .filter((i): i is InventoryItem => Boolean(i))
      .map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        vibes: item.vibes,
        colors: item.colors,
      }));

    const payload: any = {
      conflict_item_id: canonicalConflictItemId,
      repair_candidates: candidateItems,
      event: {
        id: event.id,
        name: event.name,
      },
      remix_tier: req.remix_tier,
      current_accessories: req.current_config.accessories,
    };
    if (feedback) {
      payload.feedback = feedback;
    }
    return JSON.stringify(payload, null, 2);
  };

  let geminiOutput: RepairGeminiOutput | null = null;
  let modelUsed: string | undefined = undefined;
  let aiStatus: "ok" | "timeout" | "error" = "ok";
  let errorMessage: string | undefined = undefined;

  try {
    const res1 = await callGeminiAPI({
      systemInstruction: REPAIR_SYSTEM_INSTRUCTION,
      userContent: buildRepairUserContent(),
      responseSchema: REPAIR_RESPONSE_SCHEMA,
    });
    const errors1 = validateRepairOutput(res1.data, canonicalConflictItemId, candidates);
    if (errors1.length === 0) {
      geminiOutput = res1.data;
      modelUsed = res1.modelUsed;
    } else {
      const feedback = `Previous output failed validation: ${errors1.join(
        "; "
      )}. Pick exactly one ID from repair_candidates.`;
      try {
        const res2 = await callGeminiAPI({
          systemInstruction: REPAIR_SYSTEM_INSTRUCTION,
          userContent: buildRepairUserContent(feedback),
          responseSchema: REPAIR_RESPONSE_SCHEMA,
        });
        const errors2 = validateRepairOutput(res2.data, canonicalConflictItemId, candidates);
        if (errors2.length === 0) {
          geminiOutput = res2.data;
          modelUsed = res2.modelUsed;
        } else {
          aiStatus = "error";
          errorMessage = `Validation failed: ${errors2.join("; ")}`;
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

  // Kiểm tra lỗi AI trong quá trình sửa lỗi trang phục:
  if (!geminiOutput || aiStatus !== "ok") {
    let friendlyMsg = "Có lỗi xảy ra: AI Gemini không thể thực hiện sửa lỗi trang phục!";
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

  // Repair succeeded: replace the conflict item with selected candidate
  const newAccessories = req.current_config.accessories.map((id) =>
    id === canonicalConflictItemId ? geminiOutput!.selected_candidate_id : id
  );

  const newConfig = {
    ...req.current_config,
    accessories: newAccessories,
  };

  const newDeterministicFindings = runDeterministicRules(
    deterministicRules,
    event.id,
    newConfig.accessories
  );
  const newAllFindings = [...newDeterministicFindings, ...revalidatedSemanticFindings];

  const newScoreData = calculateCulturalScore(
    newAllFindings,
    verifiedRules,
    event,
    req.remix_tier,
    newConfig.accessories,
    inventory,
    isSemanticComplete
  );

  const newVisualState = computeVisualState(newAllFindings, verifiedRules, isSemanticComplete);

  // Check if any further deterministic conflict remains
  let nextRepairData: StylistApiResponse["repair_data"] = {
    can_repair: false,
    last_repair_info: {
      status: "repaired",
      replaced_item_id: canonicalConflictItemId,
      selected_candidate_id: geminiOutput.selected_candidate_id,
      vibe_match: geminiOutput.vibe_match,
    },
  };

  const remainingConflict = newDeterministicFindings.find((f) => f.result === "conflict");
  if (remainingConflict && remainingConflict.evidence) {
    const nextConflictId = remainingConflict.evidence;
    const nextCandidates = generateRepairCandidates(
      nextConflictId,
      event.id,
      req.remix_tier,
      deterministicRules,
      newConfig.accessories,
      inventory
    );
    if (nextCandidates.length > 0) {
      nextRepairData = {
        can_repair: true,
        conflict_item_id: nextConflictId,
        candidates: nextCandidates,
        last_repair_info: nextRepairData.last_repair_info,
      };
    } else {
      nextRepairData = {
        can_repair: false,
        conflict_item_id: nextConflictId,
        reason: "no_candidates_available",
        repair_reason: "no_candidates_available",
        candidates: [],
        last_repair_info: nextRepairData.last_repair_info,
      };
    }
  }

  return {
    execution_status: {
      ai_status: "ok",
      model_used: modelUsed,
      score_complete: newScoreData.score_complete,
      semantic_analysis_complete: newScoreData.semantic_analysis_complete,
    },
    interpreted_intent: null,
    outfit_config: newConfig,
    cultural_evaluation: {
      score: newScoreData,
      findings: newAllFindings,
    },
    visual_state: newVisualState,
    repair_data: nextRepairData,
    cultural_content: {
      anchors: verifiedAnchors,
      educational_facts: verifiedFacts,
    },
    semantic_snapshot: req.semantic_snapshot ?? null,
  };
}
