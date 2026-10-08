import { TargetVisual, EvaluationResult, CulturalRule } from "../types/culture";
import { Finding } from "../types/ai";
import { VisualState } from "../types/studio";

const PRIORITY: Record<EvaluationResult, number> = {
  conflict: 4,
  caution: 3,
  unknown: 2,
  safe: 1,
};

const ALL_VISUALS: TargetVisual[] = ["collar", "torso", "feet", "head", "bag"];

export function computeVisualState(
  findings: Finding[],
  activeRules: CulturalRule[],
  isSemanticComplete: boolean
): VisualState {
  const state: VisualState = {
    collar: "safe",
    torso: "safe",
    feet: "safe",
    head: "safe",
    bag: "safe",
  };

  // If semantic is not complete, mark the target_visual of each active semantic rule as unknown
  if (!isSemanticComplete) {
    const semanticRules = activeRules.filter((r) => r.evaluation_type === "semantic");
    for (const rule of semanticRules) {
      if (rule.target_visual && PRIORITY["unknown"] > PRIORITY[state[rule.target_visual]]) {
        state[rule.target_visual] = "unknown";
      }
    }
  }

  // Then layer findings by priority: conflict(4) > caution(3) > unknown(2) > safe(1)
  for (const finding of findings) {
    const target = finding.target_visual;
    if (target && state[target] !== undefined) {
      const currentPriority = PRIORITY[state[target]] ?? 1;
      const findingPriority = PRIORITY[finding.result] ?? 1;
      if (findingPriority > currentPriority) {
        state[target] = finding.result;
      }
    }
  }

  return state;
}
