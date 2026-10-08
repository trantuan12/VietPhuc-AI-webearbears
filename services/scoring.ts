import { CulturalRule, EventData, InventoryItem, RemixTier } from "../types/culture";
import { Finding } from "../types/ai";
import { CulturalScoreData } from "../types/api";

export function calculateCulturalScore(
  findings: Finding[],
  activeRules: CulturalRule[],
  event: EventData,
  remixTier: RemixTier,
  accessories: string[],
  inventory: InventoryItem[],
  isSemanticComplete: boolean
): CulturalScoreData {
  const hasActiveSemanticRules = activeRules.some((r) => r.evaluation_type === "semantic");
  const semanticAnalysisComplete = hasActiveSemanticRules ? isSemanticComplete : true;
  const scoreComplete = semanticAnalysisComplete;

  const ruleMap = new Map<string, CulturalRule>();
  for (const r of activeRules) {
    ruleMap.set(r.id, r);
  }

  let culturalAnchorScore = 60;
  let hasCriticalConflict = false;

  for (const finding of findings) {
    const rule = ruleMap.get(finding.rule_id);
    if (!rule || rule.score_dimension !== "cultural_anchor") continue;

    if (finding.result === "conflict") {
      culturalAnchorScore -= rule.penalties?.conflict ?? 0;
      if (rule.importance === "critical") {
        hasCriticalConflict = true;
      }
    } else if (finding.result === "caution") {
      culturalAnchorScore -= rule.penalties?.caution ?? 0;
    }
  }
  culturalAnchorScore = Math.max(0, culturalAnchorScore);

  let eventContextScore = 25;
  if (!event.allowed_remix_tiers.includes(remixTier)) {
    eventContextScore -= event.tier_mismatch_penalty;
  }

  for (const finding of findings) {
    const rule = ruleMap.get(finding.rule_id);
    if (!rule || rule.score_dimension !== "event_context") continue;

    if (finding.result === "conflict") {
      eventContextScore -= rule.penalties?.conflict ?? 0;
      if (rule.importance === "critical") {
        hasCriticalConflict = true;
      }
    } else if (finding.result === "caution") {
      eventContextScore -= rule.penalties?.caution ?? 0;
    }
  }
  eventContextScore = Math.max(0, eventContextScore);

  let remixCompatibilityScore = 15;
  const inventoryMap = new Map<string, InventoryItem>();
  for (const item of inventory) {
    inventoryMap.set(item.id, item);
  }

  for (const accId of accessories) {
    const item = inventoryMap.get(accId);
    if (item && !item.remix_tiers.includes(remixTier)) {
      remixCompatibilityScore -= 5;
    }
  }
  remixCompatibilityScore = Math.max(0, remixCompatibilityScore);

  let total: number | null = null;
  if (scoreComplete) {
    total = Math.round(culturalAnchorScore + eventContextScore + remixCompatibilityScore);
    if (hasCriticalConflict) {
      total = Math.min(total, 49);
    }
  }

  let status: CulturalScoreData["status"] = "safe";
  const hasConflict = findings.some((f) => f.result === "conflict");
  const hasCaution = findings.some((f) => f.result === "caution");

  if (hasConflict) {
    status = "conflict";
  } else if (hasCaution) {
    status = "caution";
  } else if (!scoreComplete) {
    status = "unknown";
  } else {
    status = "safe";
  }

  return {
    total,
    breakdown: {
      cultural_anchor: culturalAnchorScore,
      event_context: eventContextScore,
      remix_compatibility: remixCompatibilityScore,
    },
    status,
    is_complete: scoreComplete,
    score_complete: scoreComplete,
    semantic_analysis_complete: semanticAnalysisComplete,
  };
}
