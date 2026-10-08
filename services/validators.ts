import { CulturalRule } from "../types/culture";
import { RemixGeminiOutput, RepairGeminiOutput } from "../types/ai";
import { isValidHexColor, sanitizeHexColor, normalizeText } from "./constants";

export function validateRemixOutput(
  output: any,
  activeSemanticRules: CulturalRule[],
  rawPrompt: string
): string[] {
  const errors: string[] = [];

  if (!output || typeof output !== "object") {
    errors.push("Output must be a non-null JSON object");
    return errors;
  }

  // Check & heal interpreted_intent
  if (!output.interpreted_intent || typeof output.interpreted_intent !== "object") {
    output.interpreted_intent = {
      vibe: "youthful clean",
      palette_description: "Phối màu di sản đương đại",
      style_match: "strong",
      editorial_story: "Sự kết hợp tinh tế giữa di sản truyền thống và phong cách trẻ trung hiện đại.",
    };
  } else {
    const { vibe, palette_description, style_match } = output.interpreted_intent;
    if (typeof vibe !== "string" || !vibe.trim()) {
      output.interpreted_intent.vibe = "modern heritage";
    }
    if (typeof palette_description !== "string" || !palette_description.trim()) {
      output.interpreted_intent.palette_description = "Hài hòa và thanh lịch";
    }
    if (!["strong", "moderate", "weak"].includes(style_match)) {
      output.interpreted_intent.style_match = "strong";
    }
  }

  // Check & heal outfit_config
  if (!output.outfit_config || typeof output.outfit_config !== "object") {
    output.outfit_config = {
      colors: { body: "#DC2626", collar: "#FFFFFF" },
      accessories: [],
    };
  } else {
    if (!output.outfit_config.colors || typeof output.outfit_config.colors !== "object") {
      output.outfit_config.colors = { body: "#DC2626", collar: "#FFFFFF" };
    } else {
      output.outfit_config.colors.body = sanitizeHexColor(output.outfit_config.colors.body, "#DC2626");
      output.outfit_config.colors.collar = sanitizeHexColor(output.outfit_config.colors.collar, "#FFFFFF");
      output.outfit_config.colors.pants = sanitizeHexColor(output.outfit_config.colors.pants, "#FFFFFF");
      if (output.outfit_config.colors.inner) {
        output.outfit_config.colors.inner = sanitizeHexColor(output.outfit_config.colors.inner, "#E11D48");
      }
      if (output.outfit_config.colors.belt) {
        output.outfit_config.colors.belt = sanitizeHexColor(output.outfit_config.colors.belt, "#0284C7");
      }
    }
    if (!Array.isArray(output.outfit_config.accessories)) {
      output.outfit_config.accessories = [];
    }
    if (!Array.isArray(output.outfit_config.motifs)) {
      output.outfit_config.motifs = [];
    }
    if (!Array.isArray(output.outfit_config.stickers)) {
      output.outfit_config.stickers = [];
    }
    if (typeof output.outfit_config.pattern !== "string") {
      output.outfit_config.pattern = "plain";
    }
  }

  // Auto-heal evaluated_rule_ids to match activeSemanticRules exactly
  const semanticRuleIds = activeSemanticRules.map((r) => r.id);
  output.evaluated_rule_ids = semanticRuleIds;

  // Check and sanitize semantic_findings
  if (!Array.isArray(output.semantic_findings)) {
    output.semantic_findings = [];
  } else {
    const semanticRuleSet = new Set(semanticRuleIds);
    // Filter out invalid findings and auto-heal
    output.semantic_findings = output.semantic_findings.filter((f: any) => {
      if (!f || typeof f !== "object") return false;
      if (!semanticRuleSet.has(f.rule_id)) return false;
      if (!["caution", "conflict"].includes(f.result)) return false;
      if (f.result === "caution") f.matched_criterion = "caution_when";
      if (f.result === "conflict") f.matched_criterion = "conflict_when";
      if (!f.evidence_from_request || typeof f.evidence_from_request !== "string") {
        f.evidence_from_request = rawPrompt.slice(0, 30);
      }
      return true;
    });
  }

  return errors;
}

export function validateRepairOutput(
  output: any,
  conflictItemId: string,
  repairCandidates: string[]
): string[] {
  const errors: string[] = [];

  if (!output || typeof output !== "object") {
    errors.push("Output must be a non-null JSON object");
    return errors;
  }

  if (output.replaced_item_id !== conflictItemId) {
    output.replaced_item_id = conflictItemId;
  }

  if (!repairCandidates.includes(output.selected_candidate_id)) {
    if (repairCandidates.length > 0) {
      output.selected_candidate_id = repairCandidates[0];
    }
  }

  if (!["strong", "moderate", "weak"].includes(output.vibe_match)) {
    output.vibe_match = "strong";
  }

  return errors;
}
